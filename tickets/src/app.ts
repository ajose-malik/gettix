import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@gettix_ma/common'
import { createTicketRouter } from './routes/new'

const app = express()
app.set('trust proxy', true) // Allow proxies to be used i.e. nginx
app.use(express.json())
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test'
	})
)

app.use(createTicketRouter)
app.use(errorHandler)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})



export { app }
