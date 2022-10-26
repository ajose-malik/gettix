import { Subjects, Listener, OrderCreatedEvent } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { expirationQueue } from '../../queues/expiration-queue'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated
	queueGroupName = queueGroupName

	async onMessage(
		data: OrderCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		await expirationQueue.add({
			orderId: data.id
		})

		msg.ack()
	}
}
