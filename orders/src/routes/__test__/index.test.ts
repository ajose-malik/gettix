import request from 'supertest'
import { app } from '../../app'

const createTicket = (title: string, price: number) => {
	return request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title, price })
		.expect(201)
}

it('should fetch a list of tickets', async () => {
	await createTicket('hi', 5)
	await createTicket('hello', 10)
	await createTicket('aloha', 20)

	const response = await request(app).get('/api/tickets').send().expect(200)

	expect(response.body.length).toEqual(3)
})
