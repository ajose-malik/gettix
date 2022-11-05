import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@gettix_ma/common'

const app = express()
app.set('trust proxy', true) // Allow proxies to be used i.e. nginx
app.use(express.json())
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test'
	})
)

app.use(currentUser)
app.use(errorHandler)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})

export { app }
