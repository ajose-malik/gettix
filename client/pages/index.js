import buildClient from '../api/build-client'
import Link from 'next/link'

const LandingPage = ({ tickets }) => {
	if (tickets) {
		const ticketList = tickets.map((ticket, idx) => {
			return (
				<tr key={idx}>
					<td>{ticket.title}</td>
					<td>{ticket.price}</td>
					<td>
						<Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
							<a>View</a>
						</Link>
					</td>
				</tr>
			)
		})
		return (
			<div>
				<h1>Tickets</h1>
				<table className='table'>
					<thead>
						<tr>
							<th>Title</th>
							<th>Price</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>{ticketList}</tbody>
				</table>
			</div>
		)
	}
}

export const getServerSideProps = async context => {
	const client = buildClient(context)
	try {
		const currentUserData = await client.get('/api/users/currentuser')
		const ticketData = await client.get('/api/tickets')

		return { props: { tickets: ticketData.data, currentUser: currentUserData.data } }
	} catch (err) {
		return { props: {} }
	}
}

export default LandingPage
