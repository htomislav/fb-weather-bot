const weatherApiSender = require('../apiSenders/weatherApiSender');
const db = require('../../db/db');

module.exports = {

    process: function (weatherMatchResult) {
        const locationName = toLocationName(weatherMatchResult);

        return db.findCurrentWeather(locationName)
            .then(function (weatherDao) {
                if (weatherDao) {
                    console.log(locationName, "found in cache")
                    return toWeatherResponseMessage(weatherDao.weatherInfo);
                }
                return weatherApiSender.sendWeatherQuery(locationName)
                    .then(function (weatherResponseBody) {
                        if (weatherResponseBody) {
                            return db.updateCurrentWeather(locationName, weatherResponseBody)
                                .then(function () {
                                    return toWeatherResponseMessage(weatherResponseBody);
                                })
                        }
                    })
            })
    }
}

function toLocationName(weatherMatchResult) {
    var weatherQuery = weatherMatchResult.city;
    if (weatherMatchResult.country) {
        weatherQuery += ',' + weatherMatchResult.country;
    }
    return weatherQuery.toLowerCase();
}

function toWeatherResponseMessage(weatherInfo) {
    var responseText = weatherInfo.name + ", " + weatherInfo.sys.country + ": ";
    var weather = weatherInfo.weather[0];
    responseText += weather.main + " - " + weather.description;
    responseText += ", temperature: " + weatherInfo.main.temp + " Celsius"
    return responseText;
}
