const ForecastCard = ({ forecast }) => (
    <div className="bg-blue-50 rounded-md p-4 text-center shadow-sm">
        <p className="font-semibold">{forecast.date}</p>
        <p>Temp: {forecast.temp.day}°C</p>
        <p>{forecast.weather[0].description}</p>
    </div>
);

export default ForecastCard;
