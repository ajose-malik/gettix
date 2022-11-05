import { Subjects, Listener, OrderCancelledEvent } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'
import { OrderStatus } from '@gettix_ma/common'
// import { OrderUpdatedPublisher } from '../publisher/order-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled
	queueGroupName = queueGroupName

	async onMessage(
		data: OrderCancelledEvent['data'],
		msg: Message
	): Promise<void> {
		const order = await Order.findOne({
			_id: data.id,
			version: data.version - 1
		})

		if (!order) {
			throw new Error('Order not found')
		}

		order.set({ status: OrderStatus.Cancelled })
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
