import axios from "axios";

export const fetchForecast = async (location) => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) throw new Error("Backend URL is not defined");

        const response = await axios.get(`${backendUrl}/forecast`, {
            params: { location },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.status == 429) {
            throw new Error('Reaching the max limit of tomorrow.io API calls. ');
        }
        console.error('Error fetching weather:', error);
        throw error;
    }
};
