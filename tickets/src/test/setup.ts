import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

// Declare signin type glabally
declare global {
	var signin: () => Promise<string[]>
}

let mongo: any
beforeAll(async () => {
	// Set JWT key  manually for testing purposes
	process.env.JWT_GETTIX_KEY = 'hello'
	mongo = await MongoMemoryServer.create()
	const mongoUri = mongo.getUri()
	await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections()
	for (let collection of collections) {
		await collection.deleteMany({})
	}
})

afterAll(async () => {
	if (mongo) {
		await mongo.stop()
	}
	await mongoose.connection.close()
})

// Implement signin glabally
global.signin = async () => {
	const email = 'test@test.com'
	const password = 'password'
	const response = await request(app)
		.post('/api/users/signup')
		.send({ email, password })
		.expect(201)

	const cookie = response.get('Set-Cookie')

	return cookie
}
