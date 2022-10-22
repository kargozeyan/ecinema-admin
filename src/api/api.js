import axios from "axios";

export const BASE_URL = `http://localhost:8080`
const $api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    if (error.response.config.url === '/auth/login') {
        throw error;
    }
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post(`${BASE_URL}/auth/refresh`, localStorage.getItem("refreshToken"))
            localStorage.setItem('accessToken', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('Not authorized')
        }
    }
    throw error;
})

export default $api