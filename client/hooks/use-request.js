import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body }) => {
	const [errors, setErrors] = useState(null)

	const doRequest = async () => {
		try {
      setErrors(null)
			const response = await axios[method](url, body)
			return response.data
		} catch (err) {
			const errMessage = err.response.data.errors
			setErrors(
				<div className='alert alert-danger'>
					<h4>Something went wrong</h4>
					<ul className='my-0'>
						{errMessage.map((err, i) => (
							<li key={i}>{err.message}</li>
						))}
					</ul>
				</div>
			)
		}
	}

	return { doRequest, errors }
}
