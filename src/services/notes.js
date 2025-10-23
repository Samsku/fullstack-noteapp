import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const toggleImportance = (id) => {
    return axios.get(`${baseUrl}/${id}`)
        .then(res => {
            const note = res.data;
            const changedNote = { ...note, important: !note.important };
            return axios.put(`${baseUrl}/${id}`, changedNote).then(res => res.data);
        })
        .catch(error => {
            console.error(`Error toggling importance for note ${id}:`, error);
            throw error;
        });
};

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
    update,
    toggleImportance
}