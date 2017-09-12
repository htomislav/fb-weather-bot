const mongoose = require('mongoose');
const propertiesProvider = require('../services/propertiesProvider');

var CurrentWeather;

module.exports = {

    // syncrchronous method
    init: function () {
        var currentWeatherSchema = mongoose.Schema({
            locationName: {type: String, unique: true, index: true},
            weatherInfo: mongoose.Schema.Types.Mixed,
            createdAt: {type: Date, expires: propertiesProvider.WEATHER_ENTRY_EXPIRATION_SECONDS}
        });

        CurrentWeather = mongoose.model('CurrentWeather', currentWeatherSchema);
    },

    updateCurrentWeather: function (locationName, weatherInfo) {
        return CurrentWeather.findOneAndUpdate(
            {locationName: locationName},
            {locationName: locationName, weatherInfo: weatherInfo, createdAt: new Date()},
            {upsert: true})
            .then(function (oldObject) {
                console.log('Updated ', locationName)
            });
    },

    findCurrentWeather: function (locationName) {
        return CurrentWeather.findOne({locationName: locationName});
    },

    deleteAllCurrentWeathers: function () {
        return CurrentWeather.remove({});
    }
}

