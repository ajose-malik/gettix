import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent, OrderStatus } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client)
	const orderId = new mongoose.Types.ObjectId().toHexString()
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString()
	})
	ticket.set({ orderId })
	await ticket.save();
	
	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id
		}
	}

	// @ts-ignore -> ignores incorrect implementation of Message
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg, ticket, orderId }
}

it('should update orderId of ticket, publish a ticket updated event, and acknowledge (ack) pub-sub messag', async () => {
	const { listener, data, msg, ticket } = await setup()

	await listener.onMessage(data, msg)

	const updateTicket = await Ticket.findById(ticket.id)

	expect(updateTicket!.orderId).not.toBeDefined()
	expect(msg.ack).toHaveBeenCalled()
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
