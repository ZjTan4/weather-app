import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const weatherMetrics = {
    humidityAvg: {
        label: 'Humidity',
        unit: '%',
        color: 'rgb(53, 162, 235)'
    },
    temperatureAvg: {
        label: 'Temperature',
        unit: '°C',
        color: 'rgb(255, 99, 132)'
    },
    temperatureApparentAvg: {
        label: 'Feels Like',
        unit: '°C',
        color: 'rgb(75, 192, 192)'
    },
    uvIndexAvg: {
        label: 'UV Index',
        unit: '',
        color: 'rgb(255, 159, 64)'
    },
    windSpeedAvg: {
        label: 'Wind Speed',
        unit: 'km/h',
        color: 'rgb(54, 235, 162)'
    }
};

const ForecastCard = ({ forecast }) => {
    const [selectedMetric, setSelectedMetric] = useState('temperatureAvg');
    const forcastData = forecast.timelines.daily;

    const labels = forcastData.map(day => {
        const date = new Date(day.time);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    const metricData = forcastData.map(day => day.values[selectedMetric]);
    const currentMetric = weatherMetrics[selectedMetric];
    const chartData = {
        labels,
        datasets: [
            {
                label: currentMetric.label,
                data: metricData,
                borderColor: currentMetric.color,
                backgroundColor: `${currentMetric.color}50`,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${currentMetric.label} Forecast`,
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: currentMetric.label + (currentMetric.unit ? ` (${currentMetric.unit})` : ''),
                },
                ticks: {
                    callback: (value) => `${value}${currentMetric.unit}`,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="bg-blue-50 rounded-md p-4 shadow-sm">
            <div className="mb-4">
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {Object.entries(weatherMetrics).map(([key, { label }]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="h-[300px]">
                <Line data={chartData} options={options} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-sm">
                {forcastData.map((day, index) => (
                    <div key={index} className="text-center">
                        <p className="font-semibold">
                            {new Date(day.time).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-gray-600">
                            {Math.round(day.values[selectedMetric])}
                            {currentMetric.unit}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastCard;
