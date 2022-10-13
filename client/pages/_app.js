import 'bootstrap/dist/css/bootstrap.css'

export default ({ Component, pageProps }) => {
	const {currentUser} = pageProps
	return (
		<>
			<h1>Header {currentUser ? currentUser.email : null}</h1>
			<Component {...pageProps} />
		</>
	)
}
