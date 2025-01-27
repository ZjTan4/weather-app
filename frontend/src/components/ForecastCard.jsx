const ForecastCard = ({ forecast }) => {
    return (
        <div className="bg-blue-50 rounded-md p-4 text-center shadow-sm">
            <p className="font-semibold">{forecast}</p>
            <p>Temp: {forecast}°C</p>
            <p>{forecast}</p>
        </div>
    )
};

export default ForecastCard;
