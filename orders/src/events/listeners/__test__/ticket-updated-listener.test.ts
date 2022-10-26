import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { TicketUpdatedEvent } from '@gettix_ma/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	const listener = new TicketUpdatedListener(natsWrapper.client)
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20
	})
	await ticket.save()

	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: 'new concert',
		price: 500,
		userId: new mongoose.Types.ObjectId().toHexString()
	}

	// @ts-ignore -> ignores incorrect implementation of Message
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg, ticket }
}

it('should update and save a ticket', async () => {
	const { listener, data, msg, ticket } = await setup()

	await listener.onMessage(data, msg)

	const updatedTicket = await Ticket.findById(ticket.id)

	// expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.title).toEqual(data.title)
	expect(updatedTicket!.price).toEqual(data.price)
	expect(updatedTicket!.version).toEqual(data.version)
})

it('should acknowledge (ack) pub-sub message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})

it('should not acknowledge (ack) pub-sub message if version number is out of sync', async () => {
	const { listener, data, msg } = await setup()

	data.version = 10

	try {
		await listener.onMessage(data, msg)
	} catch (er) {}

	expect(msg.ack).not.toHaveBeenCalled()
})
