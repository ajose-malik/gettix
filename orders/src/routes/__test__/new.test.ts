import mongoose from 'mongoose'
import request from 'supertest'
import { OrderStatus } from '@gettix_ma/common'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('should return error if ticket does not exist', async () => {
	const ticketId = new mongoose.Types.ObjectId()

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404)
})

it('should return error if ticket is reserved', async () => {
	const ticket = Ticket.build({
		id: 'test',
		title: 'concert',
		price: 20
	})

	await ticket.save()
	const order = Order.build({
		userId: 'test',
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket
	})
	await order.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(400)
})

it('should reserve a ticket', async () => {
	const ticket = Ticket.build({
		id: 'test',
		title: 'concert',
		price: 20
	})
	await ticket.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201)
})

it('should publish event for created order', async () => {
	const ticket = Ticket.build({
		id: 'test',
		title: 'concert',
		price: 20
	})
	await ticket.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201)
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
