import express, { Request, Response } from 'express'
import {
	NotFoundError,
	requireAuth
} from '@gettix_ma/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
	const orders = await Order.find({
		userId: req.currentUser!.id
	}).populate('ticket')

	if (!orders) {
		throw new NotFoundError()
	}

	res.send(orders)
})

export { router as indexOrderRouter }
