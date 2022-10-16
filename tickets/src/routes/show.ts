import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { NotFoundError } from '@gettix_ma/common'
import { Ticket } from '../../models/tickets'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id)

	if (!ticket) {
		throw new NotFoundError()
	}

	res.send(ticket)
})

export { router as showTicketRouter }
