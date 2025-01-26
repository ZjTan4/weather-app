const express = require('express');
const axios = require('axios');
const { Weather } = require('./models');
const router = express.Router();

// Get weather data
router.get('/weather', async (req, res) => {
    const { location } = req.query;

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// CRUD operations
router.post('/save', async (req, res) => {
    try {
        const weather = new Weather(req.body);
        await weather.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to save data' });
    }
});

router.get('/records', async (req, res) => {
    try {
        const records = await Weather.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

module.exports = router;
