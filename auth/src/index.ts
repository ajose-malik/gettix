import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
	if (!process.env.JWT_GETTIX_KEY) {
		throw new Error('JWT_GETTIX_KEY must be defined')
	}

	try {
		await mongoose.connect('mongodb://auth-mongo-service:27017/auth')
		console.log('STARTED DATABASE')
	} catch (err) {
		console.error(err)
	}
	app.listen(3000, () => console.log('STARTED PORT 3000'))
}

start()

// gettix.dev/api/users/currentuser
// thisisunsafe
