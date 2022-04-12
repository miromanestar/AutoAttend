import axios from 'axios'

const Axios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
})

export default Axios