import axios from 'axios'

export default ({ req }) => {
	// Decide to request information from the server or the client side
	if (typeof window === 'undefined') {
		// Server side
		// 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers
		})
	} else {
		// Client side
		return axios.create({})
	}
}
