const mongoose = require('mongoose');
const propertiesProvider = require('../services/propertiesProvider');

let CurrentWeather;

module.exports = {

    // initializes weather schema (synchronous method)
    init() {
        const currentWeatherSchema = mongoose.Schema({
            locationName: {type: String, unique: true, index: true},
            weatherInfo: mongoose.Schema.Types.Mixed,
            createdAt: {type: Date, expires: propertiesProvider.WEATHER_ENTRY_EXPIRATION_SECONDS}
        });

        CurrentWeather = mongoose.model('CurrentWeather', currentWeatherSchema);
    },

    // updates current weather in DB. does not return anything.
    updateCurrentWeather(locationName, weatherInfo) {
        return CurrentWeather.findOneAndUpdate(
            {locationName: locationName},
            {locationName: locationName, weatherInfo: weatherInfo, createdAt: new Date()},
            {upsert: true})
            .then((oldObject) => {
                console.log(`Updated ${locationName}`)
            });
    },

    // finds weather object by locationName
    findCurrentWeather(locationName) {
        return CurrentWeather.findOne({locationName: locationName});
    },

    // deletes all weather objects
    deleteAllCurrentWeathers() {
        return CurrentWeather.remove({});
    }
}

