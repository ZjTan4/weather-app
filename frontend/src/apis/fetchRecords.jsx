import axios from "axios";

export const fetchRecords = async ({ location, startDate, endDate } = {}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) throw new Error("Backend URL is not defined");

    const response = await axios.get(`${backendUrl}/records`, {
        params: {
            location,
            startDate,
            endDate
        }
    });
    return response.data;
};