import request from 'supertest'
import { app } from '../../app'

it('should listen to ticket route for post request', async () => {
	const response = await request(app).post('/api/tickets').send({})
	expect(response.status).not.toEqual(404)
})

it('should only be accessed if user is signed in', async () => {})

it('should return error with invalid title', async () => {})

it('should return error with invalid price', async () => {})

it('should create ticket with valid inputs', async () => {})
