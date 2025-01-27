import axios from 'axios';

export const deleteRecord = async (id) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
        const response = await axios.delete(`${backendUrl}/records/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting record:', error);
        throw error.response?.data || error;
    }
};