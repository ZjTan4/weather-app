export const getWeatherCondition = (code) => {
    const conditions = {
        1000: "Clear",
        1100: "Mostly Clear",
        1101: "Partly Cloudy",
        1102: "Mostly Cloudy",
        1001: "Cloudy",
        2000: "Fog",
        4000: "Drizzle",
        4001: "Rain",
        4200: "Light Rain",
        4201: "Heavy Rain",
        5000: "Snow",
        5001: "Flurries",
        5100: "Light Snow",
        5101: "Heavy Snow",
        6000: "Freezing Drizzle",
        6001: "Freezing Rain",
        7000: "Ice Pellets",
        8000: "Thunderstorm"
    };
    return conditions[code] || "Unknown";
};

export const getWeatherIcon = (code) => {
    const icons = {
        1000: "☀️",
        1100: "🌤️",
        1101: "⛅",
        1102: "🌥️",
        1001: "☁️",
        2000: "🌫️",
        4000: "🌧️",
        4001: "🌧️",
        4200: "🌦️",
        4201: "⛈️",
        5000: "🌨️",
        5001: "🌨️",
        5100: "🌨️",
        5101: "🌨️",
        6000: "🌧️",
        6001: "🌧️",
        7000: "🌨️",
        8000: "⛈️"
    };
    return icons[code] || "❓";
};

const WeatherCard = ({ weather }) => {
    return (
        <div className="bg-white rounded-md shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold">{weather.location.name}</h2>
            <div className="flex items-center space-x-4 mt-4">
                <div className="text-4xl">
                    {getWeatherIcon(weather.data.values.weatherCode)}
                </div>
                <div>
                    <p className="text-lg">Temperature: {weather.data.values.temperature}°C</p>
                    <p>Condition: {getWeatherCondition(weather.data.values.weatherCode)}</p>
                    <p>Humidity: {weather.data.values.humidity}%</p>
                    <p>Wind Speed: {weather.data.values.windSpeed} m/s</p>
                    <p>Feels like: {weather.data.values.temperatureApparent}°C</p>
                    <p>UV Index: {weather.data.values.uvIndex}</p>
                </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                <p>Visibility: {weather.data.values.visibility} km</p>
                <p>Precipitation Probability: {weather.data.values.precipitationProbability}%</p>
            </div>
        </div>
    );
};

export default WeatherCard;
