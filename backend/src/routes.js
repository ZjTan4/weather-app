const express = require('express');
const axios = require('axios');
const { Weather } = require('./models');
const router = express.Router();

// Get weather data
router.get('/weather', async (req, res) => {
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
    const request = `${weather_uri}/weather/realtime?location=${location}&apikey=${weather_apiKey}`;

    try {
        console.log('Making request to:', request);
        const response = await axios.get(request);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error.message);
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
