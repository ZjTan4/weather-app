const WeatherCard = ({ weather }) => (
    <div className="bg-white rounded-md shadow-md p-6 mt-4">
        <h2 className="text-2xl font-bold">{weather.name}</h2>
        <div className="flex items-center space-x-4 mt-4">
            <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather icon"
                className="w-16 h-16"
            />
            <div>
                <p className="text-lg">Temperature: {weather.main.temp}°C</p>
                <p>Condition: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind: {weather.wind.speed} m/s</p>
            </div>
        </div>
    </div>
);

export default WeatherCard;
