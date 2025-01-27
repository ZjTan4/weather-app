const express = require('express');
const axios = require('axios');
const { Weather } = require('./models');
const router = express.Router();

// Get weather data
router.get('/weather', async (req, res) => {
    try {
        const { location } = req.query;

        //go for DB first
        const recentWeather = await Weather.findOne({
            'location.name': location,
            time: {
                $gte: new Date(Date.now() - 30 * 60 * 1000) // Data less than 30 minutes old
            }
        }).sort({ time: -1 });

        if (recentWeather) {
            console.log('Returning cached weather data');
            return res.json({
                data: {
                    time: recentWeather.time,
                    values: recentWeather.values
                },
                location: recentWeather.location
            });
        }

        // If no recent data found, fetch from API
        const weather_uri = process.env.WEATHER_URI;
        const weather_apiKey = process.env.WEATHER_API_KEY;

        if (!weather_uri || !weather_apiKey) {
            throw new Error('Missing environment variables');
        }

        const request = `${weather_uri}/weather/realtime?location=${location}&apikey=${weather_apiKey}`;
        const response = await axios.get(request);

        // Save the new data to MongoDB
        const weatherData = new Weather({
            time: response.data.data.time,
            values: response.data.data.values,
            location: response.data.location
        });
        await weatherData.save();

        res.json(response.data);
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
        console.error('Missing environment variables:', {
            weather_uri: !!weather_uri,
            weather_apiKey: !!weather_apiKey
        });
        return res.status(500).json({
            error: 'Server configuration error - missing environment variables'
        });
    }

    const { location } = req.query;
    const request = `${weather_uri}/weather/forecast?location=${location}&timesteps=1d&apikey=${weather_apiKey}`;

    try {
        console.log('Making request to:', request);
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
        const { // some default values
            location = "Calgary",
            startTime = "2025-01-25T14:09:50Z",
            endTime = "2025-01-26T14:09:50Z",
            units = "metric",
        } = req.body;

        // Check for cached historical data
        const cachedData = await Weather.find({
            'location.name': location,
            time: {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            }
        }).sort({ time: 1 });

        // If we have all the data points, return from cache
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const expectedDataPoints = Math.ceil((endDate - startDate) / (60 * 60 * 1000)); // Hourly data points

        if (cachedData.length >= expectedDataPoints) {
            console.log('Returning cached historical data');
            return res.json({
                data: {
                    timelines: cachedData.map(record => ({
                        time: record.time,
                        values: record.values
                    }))
                },
                location: cachedData[0].location
            });
        }

        // If not all data is cached, fetch from API
        const weather_uri = process.env.WEATHER_URI;
        const weather_apiKey = process.env.WEATHER_API_KEY;

        if (!weather_uri || !weather_apiKey) {
            throw new Error('Missing environment variables');
        }

        const request = `${weather_uri}/historical?apikey=${weather_apiKey}`;
        const payload = { location, fields, startTime, endTime, units };

        const response = await axios.post(request, payload, {
            headers: {
                'apikey': weather_apiKey,
                'Content-Type': 'application/json'
            }
        });

        // Save historical data to MongoDB
        const historicalPromises = response.data.data.timelines.map(timeline => {
            return new Weather({
                time: timeline.time,
                values: timeline.values,
                location: response.data.location,
                isHistorical: true
            }).save();
        });

        await Promise.all(historicalPromises);

        res.json(response.data);
    } catch (error) {
        console.error('Error in historical route:', error);
        res.status(500).json({
            error: 'Failed to fetch historical weather data',
            details: error.message
        });
    }
});

// CRUD operations
router.post('/save', async (req, res) => {
    try {
        console.log('Attempting to save weather data:', req.body);

        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Empty request body received');
            return res.status(400).json({ error: 'Request body is empty' });
        }

        const weather = new Weather(req.body);

        // Validate weather object before saving
        const validationError = weather.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
                error: 'Invalid data format',
                details: validationError.message
            });
        }

        const savedWeather = await weather.save();
        console.log('Weather data saved successfully:', savedWeather);

        res.status(201).json({
            message: 'Data saved successfully',
            data: savedWeather
        });
    } catch (err) {
        console.error('Error saving weather data:', err);
        res.status(400).json({
            error: 'Failed to save data',
            details: err.message
        });
    }
});

router.get('/records', async (req, res) => {
    try {
        console.log('Fetching weather records');

        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await Weather.countDocuments();

        // Get records with pagination
        const records = await Weather.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        console.log(`Found ${records.length} records`);

        res.json({
            data: records,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                recordsPerPage: limit
            }
        });
    } catch (err) {
        console.error('Error fetching records:', err);
        res.status(500).json({
            error: 'Failed to fetch records',
            details: err.message
        });
    }
});


module.exports = router;
