import axios from "axios";

export const fetchWeather = async (location) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) throw new Error("Backend URL is not defined");

    const response = await axios.get(`${backendUrl}/weather`, {
        params: { location },
    });
    return response.data;
};
