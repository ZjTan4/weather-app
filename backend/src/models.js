const mongoose = require('mongoose');
const { normalizeDate } = require('./utils');

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
    timestamps: true
});

// Set date to midnight UTC to exclude time component
WeatherSchema.pre('save', function (next) {
    this.date = new Date(normalizeDate(this.date));
    next();
});

WeatherSchema.index(
    {
        'location.name': 1,
        'date': 1
    },
    { unique: true }
);
WeatherSchema.index({ date: -1 });
WeatherSchema.index({ 'location.lat': 1, 'location.lon': 1 });

WeatherSchema.statics.upsertWeather = async function (weatherData) {
    const { date, location, values } = weatherData;
    const normalizedDate = new Date(normalizeDate(date));

    return this.findOneAndUpdate(
        {
            'location.name': location.name,
            date: normalizedDate
        },
        {
            $set: {
                location,
                values,
                date: normalizedDate
            }
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );
};

const Weather = mongoose.model('Weather', WeatherSchema);

module.exports = { Weather };
