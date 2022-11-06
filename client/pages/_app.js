import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/header'

export default ({ Component, pageProps }) => {
	const { currentUser } = pageProps
	return (
		<div>
			<Header currentUser={currentUser} />
			<div className='container'>
				<Component {...pageProps} />
			</div>
		</div>
	)
}
