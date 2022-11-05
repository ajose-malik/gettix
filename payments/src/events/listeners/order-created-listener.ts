import { Subjects, Listener, OrderCreatedEvent } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'
// import { OrderUpdatedPublisher } from '../publisher/order-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated
	queueGroupName = queueGroupName

	async onMessage(
		data: OrderCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		const order = Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version
		})

		// if (!order) {
		// 	throw new Error('Order not found')
		// }
		order.set({ orderId: data.id })

		await order.save()
		// await new OrderUpdatedPublisher(this.client).publish({
		// 	id: order.id,
		// 	orderId: order.orderId,
		// 	version: order.version,
		// 	title: order.title,
		// 	price: order.price,
		// 	userId: order.userId
		// }) // Grab natsWrapper client from OrderUpdatedPublisher

		msg.ack()
	}
}
