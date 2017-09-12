const mongoose = require('mongoose');
const propertiesProvider = require('../services/propertiesProvider');

var CurrentWeather;

module.exports = {

    // initializes weather schema (synchronous method)
    init: function () {
        var currentWeatherSchema = mongoose.Schema({
            locationName: {type: String, unique: true, index: true},
            weatherInfo: mongoose.Schema.Types.Mixed,
            createdAt: {type: Date, expires: propertiesProvider.WEATHER_ENTRY_EXPIRATION_SECONDS}
        });

        CurrentWeather = mongoose.model('CurrentWeather', currentWeatherSchema);
    },

    // updates current weather in DB. does not return anything.
    updateCurrentWeather: function (locationName, weatherInfo) {
        return CurrentWeather.findOneAndUpdate(
            {locationName: locationName},
            {locationName: locationName, weatherInfo: weatherInfo, createdAt: new Date()},
            {upsert: true})
            .then(function (oldObject) {
                console.log('Updated ', locationName)
            });
    },

    // finds weather object by locationName
    findCurrentWeather: function (locationName) {
        return CurrentWeather.findOne({locationName: locationName});
    },

    // deletes all weather objects
    deleteAllCurrentWeathers: function () {
        return CurrentWeather.remove({});
    }
}

