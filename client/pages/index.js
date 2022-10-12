import axios from 'axios'
import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
	console.log(currentUser)
	return <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>
}

LandingPage.getInitialProps = async context => {
	// Check if request is made from server or client
	const client = buildClient(context)
	const { data } = await client.get('/api/users/currentuser').catch(err => null)
	return data
}

export default LandingPage
