var mongoose = require('mongoose');
var Promise = require('bluebird');

if (!process.env.WEATHER_ENTRY_EXPIRATION_SECONDS) {
    throw Error("WEATHER_ENTRY_EXPIRATION_SECONDS undefined")
}

mongoose.Promise = Promise;

var dbObject = {

    updateCurrentWeather: function (locationName, weatherInfo) {
        return this.CurrentWeather.findOneAndUpdate(
            {locationName: locationName},
            {locationName: locationName, weatherInfo: weatherInfo, createdAt: new Date()},
            {upsert: true})
            .then(function (oldObject) {
            });
    },

    findCurrentWeather: function (locationName) {
        return this.CurrentWeather.findOne({locationName: locationName});
    },

    deleteAllCurrentWeathers: function () {
        return this.CurrentWeather.remove({});
    }
}

mongoose.connect('mongodb://localhost/fb-weather-db')
    .then(function () {
        console.log('Connected to MongoDB');
        dbObject.CurrentWeather = createCurrentWeatherSchema();
        dbObject.isInitialized = true;
    })

function createCurrentWeatherSchema() {
    var currentWeatherSchema = mongoose.Schema({
        locationName: {type: String, unique: true, index: true},
        weatherInfo: mongoose.Schema.Types.Mixed,
        createdAt: {type: Date, expires: process.env.WEATHER_ENTRY_EXPIRATION_SECONDS}
    });

    return mongoose.model('CurrentWeather', currentWeatherSchema);
}


module.exports = dbObject;