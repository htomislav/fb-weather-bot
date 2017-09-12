const mongoose = require('mongoose');
const Promise = require('bluebird');
const propertiesProvider = require('../services/propertiesProvider');

mongoose.Promise = Promise;

const dbObject = {

    updateCurrentWeather: function (locationName, weatherInfo) {
        return this.CurrentWeather.findOneAndUpdate(
            {locationName: locationName},
            {locationName: locationName, weatherInfo: weatherInfo, createdAt: new Date()},
            {upsert: true})
            .then(function (oldObject) {
                console.log('Updated ', locationName)
            });
    },

    findCurrentWeather: function (locationName) {
        return this.CurrentWeather.findOne({locationName: locationName});
    },

    deleteAllCurrentWeathers: function () {
        return this.CurrentWeather.remove({});
    }
}

mongoose.connect(propertiesProvider.MONGODB_URI)
    .then(function () {
        console.log('Connected to MongoDB');
        dbObject.CurrentWeather = createCurrentWeatherSchema();
        dbObject.isInitialized = true;
    })

function createCurrentWeatherSchema() {
    var currentWeatherSchema = mongoose.Schema({
        locationName: {type: String, unique: true, index: true},
        weatherInfo: mongoose.Schema.Types.Mixed,
        createdAt: {type: Date, expires: propertiesProvider.WEATHER_ENTRY_EXPIRATION_SECONDS}
    });

    return mongoose.model('CurrentWeather', currentWeatherSchema);
}


module.exports = dbObject;