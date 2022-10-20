import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('should listen to ticket route for post request', async () => {
	const response = await request(app).post('/api/tickets').send({})
	expect(response.status).not.toEqual(404)
})

it('should sadly deny access if user is not signed in', async () => {
	const response = await request(app).post('/api/tickets').send({})
	expect(response.status).toEqual(401)
})

it('should return error with invalid title', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: '', price: 10 })
		.expect(400)

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ price: 10 })
		.expect(400)
})

it('should return error with invalid price', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'hello', price: -10 })
		.expect(400)

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'hello' })
		.expect(400)
})

it('should create ticket with valid inputs', async () => {
	let tickets = await Ticket.find({})
	expect(tickets.length).toEqual(0)

	const title = 'hi'

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title, price: 20 })
		.expect(201)

	tickets = await Ticket.find({})
	expect(tickets.length).toEqual(1)
	expect(tickets[0].price).toEqual(20)
	expect(tickets[0].title).toEqual(title)
})

it('should publish an event', async () => {
	const title = 'hi'

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title, price: 20 })
		.expect(201)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
