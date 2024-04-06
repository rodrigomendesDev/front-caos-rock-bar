import api from '../services/api'
import { getItem } from '../utils/storage'

const token = getItem('token');

export async function loadCommands() {
    try {
        const response = await api.get('/comanda', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        console.log(error.response);
    }
}