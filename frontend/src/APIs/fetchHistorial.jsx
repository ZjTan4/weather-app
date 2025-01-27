import axios from 'axios';

export const fetchHistorical = async ({
    location,
    startTime,
    endTime,
}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
        // Input validation
        if (!location) {
            throw new Error('Location is required');
        }

        if (!startTime || !endTime) {
            throw new Error('Start time and end time are required');
        }

        // Format the request body
        const requestBody = {
            location,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
        };
        console.log('Fetching historical weather data:', requestBody);

        const response = await axios.post(
            `${backendUrl}/historical`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return {
            success: true,
            data: response.data,
            error: null
        };
    } catch (error) {
        if (error.response && error.status == 403) {
            throw new Error('The authentication token in use is restricted and cannot access the historical resource.');
        }
        console.error('Error fetching historical weather:', error);
        return {
            success: false,
            data: null,
            error: error.response?.data?.error || error.message
        };
    }
};
