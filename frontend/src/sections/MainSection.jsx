import React, { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/WeatherCard";
import { fetchWeather } from "../apis/fetchWeather";
import { fetchForecast } from "../apis/fetchForecast";
import ForecastCard from "../components/ForecastCard";

const MainSection = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const mapApiKey = import.meta.env.VITE_MAP_APIKEY

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
            {
                weather && (
                    <div className="mt-10 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Location Map</h3>
                        </div>
                        <div className="relative w-full h-[450px]">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${mapApiKey}&q=${weather.location.name}`}
                            />
                        </div>
                    </div>
                )
            }
        </section>
    );
};

export default MainSection;
