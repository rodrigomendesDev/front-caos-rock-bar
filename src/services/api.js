import axios from 'axios';

export default axios.create({
    baseURL: 'https://api-caos-rock-bar.vercel.app',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})