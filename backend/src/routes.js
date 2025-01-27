const express = require('express');
const axios = require('axios');
const { Weather } = require('./models');
const { normalizeDate, areLocationsSimilar } = require('./utils');
const router = express.Router();

// Get weather data
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

        const request = `${weather_uri}/weather/realtime?location=${encodeURIComponent(location)}&apikey=${weather_apiKey}`;
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
        res.status(500).json({
            error: `Failed to fetch forecast data: ${error.message}`
        });
    }
});

router.post('/historical', async (req, res) => {
    try {
        const {
            location,
            startTime,
            endTime,
            units,
        } = req.body;

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
        if (!weather_uri || !weather_apiKey) {
            throw new Error('Missing environment variables');
        }

        const request = `${weather_uri}/historical?apikey=${weather_apiKey}`;
        const payload = { location, startTime, endTime, units };
        const response = await axios.post(request, payload);

        // Save to DB
        const historicalPromises = response.data.data.timelines.map(timeline =>
            Weather.upsertWeather({
                date: new Date(normalizeDate(timeline.time)),
                values: timeline.values,
                location: response.data.location
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
            location: response.data.location,
        });
    } catch (error) {
        console.error('Error in historical route:', error);
        res.status(500).json({
            error: 'Failed to fetch historical weather data',
            details: error.message
        });
    }
});

module.exports = router;
