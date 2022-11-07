import buildClient from '../api/build-client'
import Link from 'next/link'

const LandingPage = ({ tickets }) => {
	// const LandingPage = ({data: { currentUser, tickets }}) => {
	// return <h1>{currentUser ? 'You are signed in' : 'You are signed out'}</h1>
	const ticketList = tickets.map(ticket => {
		return (
			<tr>
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

export const getServerSideProps = async context => {
	const client = buildClient(context)
	try {
		// const { data } = await client.get('/api/users/currentuser')
		const { data } = await client.get('/api/tickets')

		return { props: { tickets: data } }
	} catch (err) {
		return { props: {} }
	}
}

export default LandingPage
