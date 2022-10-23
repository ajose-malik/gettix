import request from 'supertest'
import { OrderStatus } from '@gettix_ma/common'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('should return cancelled order', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20
	})
	await ticket.save()

	const user = global.signin()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(204)

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200)

	const deletedOrder = await Order.findById(order.id)

	expect(deletedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should publish event for cancelled order', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20
	})
	await ticket.save()

	const user = global.signin()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id
		})
		.expect(201)

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(204)

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
