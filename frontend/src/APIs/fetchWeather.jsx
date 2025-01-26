import axios from "axios";

export const fetchWeather = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/weather`, {
            params: { location },
        });
        setWeather(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};
