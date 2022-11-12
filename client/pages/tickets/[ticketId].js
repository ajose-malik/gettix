import Router from 'next/router'
import buildClient from '../../api/build-client'
import useRequest from '../../hooks/use-request'

const TicketShow = ({ ticket }) => {
	if (ticket) {
		const { doRequest, errors } = useRequest({
			url: '/api/orders',
			method: 'post',
			body: {
				ticketId: ticket.id
			},
			onSuccess: order =>
				Router.push('/orders/[orderId]', `/orders/${order.id}`)
		})

		return (
			<div>
				<h1>{ticket.title}</h1>
				<h4>{ticket.price}</h4>
				{errors}
				<button onClick={() => doRequest()} className='btn btn-primary'>
					Purchase
				</button>
			</div>
		)
	}
}

export const getServerSideProps = async context => {
	const client = buildClient(context)
	const { ticketId } = context.query

	try {
		const { data } = await client.get(`/api/tickets/${ticketId}`)
		return { props: { ticket: data } }
	} catch (error) {
		return { props: {} }
	}
}

export default TicketShow
