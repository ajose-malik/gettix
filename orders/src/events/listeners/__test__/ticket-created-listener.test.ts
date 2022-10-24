import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedListener } from '../ticket-created-listeners'
import { TicketCreatedEvent } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client)
	const data: TicketCreatedEvent['data'] = {
		version: 0,
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString()
	}

	// @ts-ignore -> ignores incorrect implementation of Message
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('should create and save a ticket', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const ticket = await Ticket.findById(data.id)

	expect(ticket).toBeDefined()
	expect(ticket!.title).toEqual(data.title)
	expect(ticket!.price).toEqual(data.price)
})

it('should acknowledge (ack) pub-sub message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})
