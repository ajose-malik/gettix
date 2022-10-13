import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
	return <h1>{currentUser ? 'You are signed in' : 'You are signed out'}</h1>
}

export const getServerSideProps = async context => {
	const client = buildClient(context)
	try {
		const { data } = await client.get('/api/users/currentuser')
		return { props: data }
	} catch (err) {
		return { props: {} }
	}
}

export default LandingPage
