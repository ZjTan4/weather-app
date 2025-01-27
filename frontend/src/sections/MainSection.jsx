import React, { useState } from "react";
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/WeatherCard";
import { fetchWeather } from "../apis/fetchWeather";
import { fetchForecast } from "../apis/fetchForecast";

const MainSection = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);

    const handleSearch = async (location) => {
        try {
            const weatherData = await fetchWeather(location);
            const forecastData = await fetchForecast(location);
            setWeather(weatherData);
            setForecast(forecastData);
        } catch (error) {
            console.error("Error fetching weather data:", error.message);
        }
    };

    return (
        <div className="p-4">
            <SearchBox onSearch={handleSearch} />
            {weather && <WeatherCard weather={weather} />}
            {forecast && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecast.map((day, index) => (
                        <div key={index}>
                            <ForecastCard forecast={day} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainSection;
