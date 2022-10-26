import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client)
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString()
	})
	await ticket.save();
	
	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: 'test',
		ticket: {
			id: ticket.id,
			price: ticket.price
		}
	}

	// @ts-ignore -> ignores incorrect implementation of Message
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg, ticket }
}

it('should set orderId of ticket', async () => {
	const { listener, data, msg, ticket } = await setup()

	await listener.onMessage(data, msg)

	const updateTicket = await Ticket.findById(ticket.id)

	expect(updateTicket!.orderId).toEqual(data.id)
})

it('should acknowledge (ack) pub-sub message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})

it('should publish a ticket updated event', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	)

	expect(data.id).toEqual(ticketUpdatedData.orderId)
})
