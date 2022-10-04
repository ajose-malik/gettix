import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
	const cookie = await signin() // signin() is set globally in setup.ts
	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200)

	expect(response.body.currentUser.email).toEqual('test@test.com')
})

it("responds with 'Not authorized' if not authenticated", async () => {
	const {
		body: { errors }
	} = await request(app).get('/api/users/currentuser').send().expect(401)

	expect(errors[0].message).toEqual('Not authorized')
})
