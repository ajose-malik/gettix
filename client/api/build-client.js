import axios from 'axios'

export default ({ req }) => {
	if (typeof window === 'undefined') {
		// Server request http://SERVICE.NAMESPACE.svc.cluster.local
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers
		})
	} else {
		// Client request
		return axios.create({
			baseUrl: '/'
		})
	}
}
