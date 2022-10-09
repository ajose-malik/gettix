import axios from 'axios'

const LandingPage = ({ currentUser }) => {
	console.log(currentUser)

	return <h1>Landing Page</h1>
}

// Render initial props from server or client side
LandingPage.getInitialProps = async ({ currentUser }) => {
	// Decide to requeust information from the server or the client side
	if (window === undefined) {
		// 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
		const { data } = await axios
			.get(
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
				{ headers: { Host: 'gettix.dev' } }
			)
			.catch(err => {
				console.log(err.message)
				return data
			})
	} else {
		const { data } = await axios.get('/api/users/currentuser').catch(err => {
			console.log(err.message)
			return data
		})
	}
}

export default LandingPage
