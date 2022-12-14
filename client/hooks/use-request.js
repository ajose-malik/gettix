import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
	const [errors, setErrors] = useState(null)

	const doRequest = async (props = {}) => {
		try {
			setErrors(null)
			const response = await axios[method](url, { ...body, ...props })

			if (onSuccess) {
				onSuccess(response.data)
			}
			return response.data
		} catch (err) {
			const errors = err.response.data.errors

			setErrors(
				<div className='alert alert-danger'>
					<h4>Something went wrong</h4>
					<ul className='my-0'>
						{errors.map((err, i) => (
							<li key={i}>{err.message}</li>
						))}
					</ul>
				</div>
			)
		}
	}
	return { doRequest, errors }
}
