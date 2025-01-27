const mongoose = require('mongoose');

// Highlight fields are listed in comment, maybe only keep them?
const WeatherValuesSchema = new mongoose.Schema({
    cloudBase: Number,
    cloudCeiling: Number,
    cloudCover: Number,
    dewPoint: Number,
    freezingRainIntensity: Number,
    hailProbability: Number,
    hailSize: Number,
    humidity: Number,                   // Humidity
    precipitationProbability: Number,
    pressureSurfaceLevel: Number,
    rainIntensity: Number,
    sleetIntensity: Number,
    snowIntensity: Number,
    temperature: Number,                // Temerature 
    temperatureApparent: Number,        // How the temerature feels like to ppl
    uvHealthConcern: Number,
    uvIndex: Number,                    // UV index
    visibility: Number,
    weatherCode: Number,                // Weather Code, defining type of weather
    windDirection: Number,
    windGust: Number,
    windSpeed: Number                   // Wind Speed
});

const LocationSchema = new mongoose.Schema({
    lat: Number,
    lon: Number,
    name: String,
    type: String
});

const WeatherSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    values: {
        type: WeatherValuesSchema,
        required: true
    },
    location: {
        type: LocationSchema,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

WeatherSchema.index({ 'location.name': 1 });
WeatherSchema.index({ date: -1 });
WeatherSchema.index({ 'location.lat': 1, 'location.lon': 1 });

const Weather = mongoose.model('Weather', WeatherSchema);

module.exports = { Weather };
