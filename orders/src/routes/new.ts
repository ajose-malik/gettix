import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
	requireAuth,
	validateRequest,
	NotFoundError,
	BadRequestError
} from '@gettix_ma/common'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // Check if input is a valid mongoDB ID
			.withMessage('Ticket ID is required')
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body

		// Find ticket the user is trying to order
		const ticket = await Ticket.findById(ticketId)
		if (!ticket) {
			throw new NotFoundError()
		}

		// Confirm ticket availability
		const isReserved = await ticket.isReserved()

		if (isReserved) {
			throw new BadRequestError('Ticket is already reserved')
		}

		// Stamp ticket with expiration date
		// Build and save user order to database
		// Publish created order

		const order = Order.build({
			ticketId,
			userId: req.currentUser!.id
		})

		await order.save()
		await new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			ticketId: order.ticketId,
			userId: order.userId
		})
		res.status(201).send(order)
	}
)

export { router as createOrderRouter }
