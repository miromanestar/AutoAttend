import axios, { AxiosInstance } from 'axios'

const Axios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string | undefined
})

export default Axios