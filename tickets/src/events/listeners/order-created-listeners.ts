import { Subjects, Listener, OrderCreatedEvent } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated
	queueGroupName = queueGroupName

	async onMessage(
		data: OrderCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		const ticket = await Ticket.findById(data.ticket.id)

		if (!ticket) {
			throw new Error('Ticket not found')
		}
		ticket.set({ orderId: data.id })

		await ticket.save()
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			orderId: ticket.orderId,
			version: ticket.version,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId
		}) // Grab natsWrapper client from TicketUpdatedPublisher

		msg.ack()
	}
}
