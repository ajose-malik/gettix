import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
	requireAuth,
	validateRequest,
	NotFoundError,
	NotAuthorizedError
} from '@gettix_ma/common'
import { Order } from '../models/order'
import { OrderDeletedPublisher } from '../events/publisher/order-deleted-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
	'/api/orders/:orderId',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.id)

		if (!order) {
			throw new NotFoundError()
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError()
		}

		const { title, price } = req.body

		order.set({ title, price })
		await order.save()
		new OrderDeletedPublisher(natsWrapper.client).publish({
			id: order.id,
			title: order.title,
			price: parseInt(order.price),
			userId: order.userId
		})

		res.send(order)
	}
)

export { router as deleteOrderRouter }
