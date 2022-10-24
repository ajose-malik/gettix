import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('should return order if found', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})
	await ticket.save()

	const user = global.signin()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200)

	expect(fetchedOrder.id).toEqual(order.id)
})

it('should return error if order does not belong to user', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})
	await ticket.save()

	const user = global.signin()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', global.signin())
		.expect(401)
})
