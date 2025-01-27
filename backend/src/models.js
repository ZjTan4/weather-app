const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    location: String,
    date: Date,
    data: Object,
});

const Weather = mongoose.model('Weather', WeatherSchema);

module.exports = { Weather };
