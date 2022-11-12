import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import buildClient from '../../api/build-client'

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0)
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order && order.id
		},
		onSuccess: () => Router.push('/orders')
	})

	if (order && currentUser) {
		useEffect(() => {
			const findTimeLeft = () => {
				const milliSecondsLeft = new Date(order.expiresAt) - new Date()
				setTimeLeft(Math.round(milliSecondsLeft / 1000))
			}

			findTimeLeft()
			const timerId = setInterval(findTimeLeft, 1000)

			return () => {
				clearInterval(timerId)
			}
		}, [order])

		if (timeLeft < 0) {
			return <div>Order Expired</div>
		}

		return (
			<div>
				Time left to pay {timeLeft} seconds
				<StripeCheckout
					token={({ id }) => doRequest({ token: id })}
					stripeKey='pk_test_51IupGKLhDjlxo8CQPB8VFQ6Z3d22XScA2HIR6o58zFbOW4PslHUQNNyr0qALTV1XrAyUbu9sX2Ki18a84Cpz0LN6007XHviDEe'
					amount={order.ticket.price * 100}
					email={currentUser.email}
				/>
				{errors}
			</div>
		)
	}
}

export const getServerSideProps = async context => {
	const client = buildClient(context)
	const { orderId } = context.query

	try {
		const orderData = await client.get(`/api/orders/${orderId}`)
		const currentUserData = await client.get('/api/users/currentuser')

		return {
			props: {
				order: orderData.data,
				currentUser: currentUserData.data
			}
		}
	} catch (error) {
		return { props: {} }
	}
}

export default OrderShow
