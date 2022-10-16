import request from 'supertest'
import { app } from '../../app'

it('should listen to ticket route for post request', async () => {
	const response = await request(app).post('/api/tickets').send({})
	expect(response.status).not.toEqual(404)
})

it('should sadly deny access if user is signed in', async () => {
	const response = await request(app).post('/api/tickets').send({})
	expect(response.status).toEqual(401)
})

it('should happily grant access if user is signed in', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({})
	expect(response.status).toEqual(200)
})

it('should return error with invalid title', async () => {})

it('should return error with invalid price', async () => {})

it('should create ticket with valid inputs', async () => {})
