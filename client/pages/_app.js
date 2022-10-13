import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/header'

export default ({ Component, pageProps }) => {
	const { currentUser } = pageProps
	return (
		<>
			<Header currentUser={currentUser} />
			<Component {...pageProps} />
		</>
	)
}
