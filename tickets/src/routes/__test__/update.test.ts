import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

const id = new mongoose.Types.ObjectId().toHexString()

it('should return 404 if ticket does not exist', async () => {
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({ title: 'hi', price: 5 })
		.expect(404)
})

it('should return 401 if user is not authenticated', async () => {
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({ title: 'hi', price: 5 })
		.expect(401)
})

it('should return 401 if user is not authorized', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'hi', price: 5 })

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({ title: 'hello', price: 15 })
		.expect(401)
})

it('should return 400 if user provides invalid title or price', async () => {
	const cookie = global.signin()

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'hi', price: 15 })

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: '', price: 15 })
		.expect(400)

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'h1', price: -10 })
		.expect(400)
})

it('should update ticket if valid inputs are provided', async () => {
	const cookie = global.signin()

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'hi', price: 15 })

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'update', price: 500 })
		.expect(200)

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.expect(200)

	expect(ticketResponse.body.title).toEqual('update')
	expect(ticketResponse.body.price).toEqual(500)
})

it('should publish an event', async () => {
	const cookie = global.signin()

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'hi', price: 15 })

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'update', price: 500 })
		.expect(200)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('should reject updates if ticket is reserved', async () => {
	const cookie = global.signin()

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'hi', price: 15 })

	const ticket = await Ticket.findById(response.body.id)
	ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
	await ticket!.save()

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'update', price: 500 })
		.expect(400)
})
