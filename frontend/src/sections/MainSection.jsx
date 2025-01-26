import React from "react";
import { fetchWeather } from "../APIs/fetchWeather";

const MainSection = () => {
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState(null);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Weather App</h1>
            <input
                type="text"
                placeholder="Enter correct location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button onClick={fetchWeather}>Get Weather</button>

            {weather && (
                <div>
                    <h2>{weather.name}</h2>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
};  

export default MainSection;