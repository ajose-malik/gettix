import buildClient from '../../api/build-client'

const OrderIndex = ({ orders }) => {
	return (
		<ul>
			{orders.map(order => {
				return (
					<li key={order.id}>
						{order.ticket.title} - {order.status}
					</li>
				)
			})}
		</ul>
	)
}

export const getServerSideProps = async context => {
	const client = buildClient(context)

	try {
		const currentUserData = await client.get('/api/users/currentuser')
		const orderStatus = await client.get('/api/orders')

		return {
			props: {
				orders: orderStatus.data,
				currentUser: currentUserData.data
			}
		}
	} catch (error) {
		return { props: {} }
	}
}

export default OrderIndex
