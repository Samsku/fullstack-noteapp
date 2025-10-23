import axios from 'axios'
import { API_BASE_URL } from '../config'

const baseUrl = `${API_BASE_URL}/api/notes`

const getAll = () => {
    return axios.get(baseUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching notes:', error);
            throw error;
        });
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating note:', error);
            throw error;
        });
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
        .then(response => response.data)
        .catch(error => {
            console.error(`Error updating note ${id}:`, error);
            throw error;
        });
}

export default {
    getAll,
    create,
    update
}