import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

export const baseUrl = process.env.REACT_APP_BACKEND_URL

const axiosInstance = axios.create({
	baseURL: baseUrl,

});

// add token to the request
axiosInstance.interceptors.request.use(
	(config) =>
	{
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken)
		{
			config.headers["Authorization"] = `${accessToken}`;
		}
		return config;
	},
	(error) =>
	{
		Promise.reject(error);
	}
);

export default axiosInstance;
