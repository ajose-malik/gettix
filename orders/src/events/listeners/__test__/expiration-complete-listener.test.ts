import mongoose from 'mongoose'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteEvent, OrderStatus } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client)
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20
	})
	await ticket.save()

	const order = Order.build({
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date(),
		ticket
	})
	await order.save()

	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id
	}

	// @ts-ignore -> ignores incorrect implementation of Message
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, order, ticket, data, msg }
}

it('should update order status to cancelled', async () => {
	const { listener, order, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const updatedOrder = await Order.findById(order.id)
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should publish order cancelled event', async () => {
	const { listener, order, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(natsWrapper.client.publish).toHaveBeenCalled()

	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	)
	expect(eventData.id).toEqual(order.id)
})

it('should acknowledge (ack) pub-sub message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})
