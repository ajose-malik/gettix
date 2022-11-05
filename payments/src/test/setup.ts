import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

// Declare signin type glabally
declare global {
	var signin: () => string[]
}

jest.mock('../nats-wrapper')

let mongo: any
beforeAll(async () => {
	// Set JWT key  manually for testing purposes
	process.env.JWT_GETTIX_KEY = 'hello'
	mongo = await MongoMemoryServer.create()
	const mongoUri = mongo.getUri()
	await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
	jest.clearAllMocks()
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
global.signin = () => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	}
	// Create JWT using payload
	const token = jwt.sign(payload, process.env.JWT_GETTIX_KEY!)

	// Build session Object with the token generated and convert to JSON
	const session = { jwt: token }
	const sessionJSON = JSON.stringify(session)

	// Encode JSON to base64
	const base64 = Buffer.from(sessionJSON).toString('base64')

	// Return the session
	return [`session=${base64}`]
}
