import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middleware/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.set('trust proxy', true) // Allow proxies to be used i.e. nginx
app.use(express.json())
app.use(
	cookieSession({
		signed: false,
		secure: true
	})
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }
