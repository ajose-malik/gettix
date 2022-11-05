import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client)

	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		expiresAt: 'test',
		userId: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 10
		}
	}

	// @ts-ignore -> ignores incorrect implementation of Message
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('should replicate the order info', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const order = await Order.findById(data.id)

	expect(order!.price).toEqual(data.ticket.price)
})

it('should acknowledge (ack) pub-sub message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})
