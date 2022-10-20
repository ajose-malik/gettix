import express, { Request, Response } from 'express'
import { NotFoundError } from '@gettix_ma/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.orderId)

	if (!order) {
		throw new NotFoundError()
	}

	res.send(order)
})

export { router as showOrderRouter }
