const express = require('express');
const axios = require('axios');
const { Weather } = require('./models');
const { normalizeDate, areLocationsSimilar } = require('./utils');
const router = express.Router();
const { fetchWeatherApi } = require('openmeteo');

// Helper function to form time ranges
const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// helper function for parsing the data from open-meteo
const parseOpenMeteoData = (responses) => {
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const daily = response.daily();
    const rawWeatherData = {
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            weatherCode: daily.variables(0).valuesArray(),
            temperature2mMax: daily.variables(1).valuesArray(),
            temperature2mMin: daily.variables(2).valuesArray(),
            apparentTemperatureMax: daily.variables(3).valuesArray(),
            apparentTemperatureMin: daily.variables(4).valuesArray(),
            uvIndexMax: daily.variables(5).valuesArray(),
            precipitationProbabilityMax: daily.variables(6).valuesArray(),
            windSpeed10mMax: daily.variables(7).valuesArray(),
        },
    };
    const weatherData = rawWeatherData.daily.time.map((time, index) => ({
        time: time,
        weatherCode: rawWeatherData.daily.weatherCode[index],
        temperature2mMax: rawWeatherData.daily.temperature2mMax[index],
        temperature2mMin: rawWeatherData.daily.temperature2mMin[index],
        apparentTemperatureMax: rawWeatherData.daily.apparentTemperatureMax[index],
        apparentTemperatureMin: rawWeatherData.daily.apparentTemperatureMin[index],
        uvIndexMax: rawWeatherData.daily.uvIndexMax[index],
        precipitationProbabilityMax: rawWeatherData.daily.precipitationProbabilityMax[index],
        windSpeed10mMax: rawWeatherData.daily.windSpeed10mMax[index]
    }));
    return weatherData;
}

//helper function for converting open-meteo's weather code to tomorrow.io
const convertOpenMeteoToTomorrowCode = (openMeteoCode) => {
    // Open-Meteo to Tomorrow.io weather code mapping
    const codeMapping = {
        0: 1000,  // Clear sky -> Clear
        1: 1100,  // Mainly clear -> Mostly Clear
        2: 1101,  // Partly cloudy -> Partly Cloudy
        3: 1102,  // Overcast -> Mostly Cloudy
        45: 2000, // Foggy -> Fog
        48: 2000, // Depositing rime fog -> Fog
        51: 4000, // Light drizzle -> Drizzle
        53: 4000, // Moderate drizzle -> Drizzle
        55: 4000, // Dense drizzle -> Drizzle
        61: 4200, // Slight rain -> Light Rain
        63: 4001, // Moderate rain -> Rain
        65: 4201, // Heavy rain -> Heavy Rain
        71: 5100, // Slight snow fall -> Light Snow
        73: 5000, // Moderate snow fall -> Snow
        75: 5101, // Heavy snow fall -> Heavy Snow
        77: 5001, // Snow grains -> Flurries
        80: 4000, // Slight rain showers -> Drizzle
        81: 4001, // Moderate rain showers -> Rain
        82: 4201, // Violent rain showers -> Heavy Rain
        85: 5100, // Slight snow showers -> Light Snow
        86: 5101, // Heavy snow showers -> Heavy Snow
        95: 8000, // Thunderstorm -> Thunderstorm
        96: 8000, // Thunderstorm with slight hail -> Thunderstorm
        99: 8000  // Thunderstorm with heavy hail -> Thunderstorm
    };

    return codeMapping[openMeteoCode] || 1000; // Default to Clear if code not found
};

// fetch weather data
router.get('/weather', async (req, res) => {
    try {
        const { location } = req.query;
        const today = normalizeDate(new Date());
        // go for DB first
        const recentWeathers = await Weather.find({
            date: new Date(today)
        });
        const recentWeather = recentWeathers.find(weather =>
            areLocationsSimilar(weather.location.name, location) // fuzzy match of location
        );

        if (recentWeather) {
            console.log('Returning cached weather data');
            return res.json({
                data: {
                    date: normalizeDate(recentWeather.date),
                    values: recentWeather.values
                },
                location: recentWeather.location,
            });
        }

        // If no data found, fetch from API
        const weather_uri = process.env.WEATHER_URI;
        const weather_apiKey = process.env.WEATHER_API_KEY;
        if (!weather_uri || !weather_apiKey) {
            throw new Error('Missing environment variables');
        }

        const request = `${weather_uri}/weather/realtime?location=${location}&apikey=${weather_apiKey}`;
        const response = await axios.get(request);

        // save data
        const weatherData = await Weather.upsertWeather({
            date: new Date(today),
            values: response.data.data.values,
            location: response.data.location
        });

        res.json({
            data: {
                date: normalizeDate(weatherData.date),
                values: weatherData.values
            },
            location: weatherData.location,
        });
    } catch (error) {
        console.error('Error in weather route:', error);
        res.status(500).json({
            error: `Failed to fetch weather data: ${error.message}`
        });
    }
});

//fetch forecast data
router.get('/forecast', async (req, res) => {
    const weather_uri = process.env.WEATHER_URI;
    const weather_apiKey = process.env.WEATHER_API_KEY;
    if (!weather_uri || !weather_apiKey) {
        throw new Error('Missing environment variables');
    }

    const { location } = req.query;
    const request = `${weather_uri}/weather/forecast?location=${location}&timesteps=1d&apikey=${weather_apiKey}`;
    try {
        const response = await axios.get(request);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching forecast:', error.message);
        if (error.response) {
            if (error.response.status === 429) {
                return res.status(429).json({
                    error: 'Rate limit exceeded: Maximum API calls per hour reached for Tomorrow.io weather API. Please try again in the next hour.'
                });
            }
            return res.status(error.response.status).json({
                error: `Failed to fetch forecast data: ${error.response.data.message || error.message}`
            });
        }
        res.status(500).json({
            error: `Failed to fetch forecast data: ${error.message}`
        });
    }
});

// fetch historical data
router.post('/historical', async (req, res) => {
    try {
        const {
            location,
            startTime,
            endTime,
        } = req.body;

        // go for DB first
        const startDate = new Date(normalizeDate(startTime));
        const endDate = new Date(normalizeDate(endTime));
        const cachedData = await Weather.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            }
        });
        const matchingData = cachedData.filter(weather =>
            areLocationsSimilar(weather.location.name, location)
        ).sort((a, b) => a.date - b.date);
        // if there are enough data in DB
        const expectedDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
        if (matchingData.length === expectedDays) {
            console.log('Returning cached historical data');
            return res.json({
                data: {
                    timelines: matchingData.map(record => ({
                        date: normalizeDate(record.date),
                        values: record.values
                    }))
                },
                location: matchingData[0].location,
            });
        }

        // fetch from API
        const weather_uri = process.env.WEATHER_URI;
        const weather_apiKey = process.env.WEATHER_API_KEY;
        const historical_weather_uri = process.env.HISTORICAL_WEATHER_URI;
        if (!weather_uri || !weather_apiKey || !historical_weather_uri) {
            throw new Error('Missing environment variables');
        }
        // fetch the lat and lon, since they are required for open-meteo
        const request = `${weather_uri}/weather/realtime?location=${location}&apikey=${weather_apiKey}`;
        const responseForLocation = await axios.get(request);
        const lat = responseForLocation.data.location.lat;
        const lon = responseForLocation.data.location.lon;
        const payload = {
            "latitude": lat,
            "longitude": lon,
            "past_days": 92,
            "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "uv_index_max", "precipitation_probability_max", "wind_speed_10m_max"]
        };
        const responses = await fetchWeatherApi(historical_weather_uri, payload);
        const weatherData = parseOpenMeteoData(responses).filter(data => {              // parse the Open-Meteo Data
            const dataTime = new Date(data.time).getTime();
            return dataTime >= startDate.getTime() && dataTime <= endDate.getTime();
        }).sort((a, b) => {                                                             // Sort the Data by date
            const timeA = new Date(a.time).getTime();
            const timeB = new Date(b.time).getTime();
            return timeB - timeA;
        });

        // Save to DB
        const historicalPromises = weatherData.map(weather =>
            Weather.upsertWeather({
                date: new Date(normalizeDate(weather.time)),
                values: {
                    temperature: Number(((weather.temperature2mMax + weather.temperature2mMin) / 2).toFixed(2)),
                    weatherCode: convertOpenMeteoToTomorrowCode(weather.weatherCode),
                    windSpeed: Number((weather.windSpeed10mMax / 3.6).toFixed(2)),      // Convert km/h to m/s (divide by 3.6)
                    precipitationProbability: weather.precipitationProbabilityMax,
                    uvIndex: Math.floor(weather.uvIndexMax),                            // Keep only integer part
                    temperatureApparent: Number(((weather.apparentTemperatureMax + weather.apparentTemperatureMin) / 2).toFixed(2))
                },
                location: responseForLocation.data.location
            })
        );
        const savedRecords = await Promise.all(historicalPromises);

        res.json({
            data: {
                timelines: savedRecords.map(record => ({
                    date: normalizeDate(record.date),
                    values: record.values
                }))
            },
            location: responseForLocation.data.location,
        });
    } catch (error) {
        console.error('Error in historical route:', error);
        if (error.response) {
            if (error.response.status === 403) {
                return res.status(403).json({
                    error: 'The authentication token in use is restricted and cannot access the requested resource.'
                });
            }
            return res.status(error.response.status).json({
                error: `Failed to fetch historical data: ${error.response.data.message || error.message}`
            });
        }
        res.status(500).json({
            error: 'Failed to fetch historical weather data',
            details: error.message
        });
    }
});

//get all records in the DB
router.get('/records', async (req, res) => {
    try {
        const records = await Weather.find({})
            .sort({ updatedAt: -1 });

        res.json({
            success: true,
            data: records,
            count: records.length,
            message: 'Successfully retrieved all weather records'
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather records',
            details: error.message
        });
    }
});

// Update a specific record
router.put('/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find and update the record
        const updatedRecord = await Weather.findByIdAndUpdate(
            id,
            {
                $set: {
                    values: updateData.values,
                    location: updateData.location,
                    date: updateData.date
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }

        res.json({
            success: true,
            data: updatedRecord,
            message: 'Weather record updated successfully'
        });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update weather record',
            details: error.message
        });
    }
});

// Delete a specific record
router.delete('/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecord = await Weather.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }

        res.json({
            success: true,
            data: deletedRecord,
            message: 'Weather record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete weather record',
            details: error.message
        });
    }
});

module.exports = router;
