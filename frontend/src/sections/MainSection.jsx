import React, { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/WeatherCard";
import { fetchWeather } from "../apis/fetchWeather";
import { fetchForecast } from "../apis/fetchForecast";
import ForecastCard from "../components/ForecastCard";

const MainSection = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);

    const handleSearch = async (location) => {
        try {
            const weatherData = await fetchWeather(location);
            // const forecastData = await fetchForecast(location);
            console.log("Weather Data:", weatherData);
            // console.log("Forecast Data:", forecastData);
            setWeather(weatherData);
            // setForecast(forecastData);
        } catch (error) {
            // console.error("Error fetching weather data:", error.message);
            alert(error.message);
        }
    };

    // use Calgary by default because I like this city :)
    useEffect(() => {
        handleSearch("Calgary");
    }, []); 

    return (
        <section className="container p-4">
            <SearchBox onSearch={handleSearch} />
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                {weather && <WeatherCard weather={weather} />}
                {forecast && <ForecastCard forecast={forecast} />}
            </div>
        </section>
    );
};

export default MainSection;
