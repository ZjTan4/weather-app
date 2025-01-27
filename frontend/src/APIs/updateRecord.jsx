import axios from 'axios';

export const updateRecord = async (id, updateData) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
        const response = await axios.put(
            `${backendUrl}/records/${id}`,
            updateData,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error updating record:', error);
        throw error.response?.data || error;
    }
};