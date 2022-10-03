import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', () => {
	process.env.JWT_GETTIX_KEY = 'hello'
	return request(app)
		.post('/api/users/signup')
		.send({ email: 'test@test.com', password: 'password' })
		.expect(201)
})

it('returns a 400 with an invalid email', () => {
	process.env.JWT_GETTIX_KEY = 'hello'
	return request(app)
		.post('/api/users/signup')
		.send({ email: 'test.com', password: 'password' })
		.expect(400)
})

it('returns a 400 with an invalid password', () => {
	return request(app)
		.post('/api/users/signup')
		.send({ email: 'test@test.com', password: 'p' })
		.expect(400)
})

it('returns a 400 with missing email and password', () => {
	return request(app)
		.post('/api/users/signup')
		.send({})
		.expect(400)
})

it('returns a 400 with missing email or password', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({email: 'test@test.com'})
		.expect(400)

	await request(app)
		.post('/api/users/signup')
		.send({ password: 'password'})
		.expect(400)
})

it('disallows duplicate emails', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({email: 'test@test.com', password: 'password'})
		.expect(201)

	await request(app)
		.post('/api/users/signup')
		.send({email: 'test@test.com', password: 'password'})
		.expect(400)
})