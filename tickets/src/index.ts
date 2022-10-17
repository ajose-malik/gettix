import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
	if (!process.env.JWT_GETTIX_KEY) {
		throw new Error('JWT_GETTIX_KEY must be defined')
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined')
	}

	try {
		await natsWrapper.connect(
			'gettix',
			'randString',
			'http://nats-service:4222'
		)

		natsWrapper.client.on('close', () => {
			console.log('NATS CONNECTION CLOSED')
			process.exit()
		})
		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		await mongoose.connect(process.env.MONGO_URI)
		console.log('STARTED DATABASE')
	} catch (err) {
		console.error(err)
	}
	app.listen(3000, () => console.log('STARTED PORT 3000'))
}

start()