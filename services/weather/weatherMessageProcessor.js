const weatherApiSender = require('../apiSenders/weatherApiSender');
const weatherDal = require('../../db/weatherDal');

module.exports = {

    // processes successful weather match results by either contacting weather API
    // for result or returning the result from the cache.
    process(weatherMatchResult) {
        const locationName = toLocationName(weatherMatchResult);

        return weatherDal.findCurrentWeather(locationName)
            .then((weatherDao) => {
                if (weatherDao) {
                    console.log(locationName, "found in cache")
                    return toWeatherResponseMessage(weatherDao.weatherInfo);
                }
                return weatherApiSender.sendWeatherQuery(locationName)
                    .then((weatherResponseBody) => {
                        if (weatherResponseBody) {
                            return weatherDal.updateCurrentWeather(locationName, weatherResponseBody)
                                .then(() => {
                                    return toWeatherResponseMessage(weatherResponseBody);
                                })
                        }
                    })
            })
    }
}

function toLocationName(weatherMatchResult) {
    let weatherQuery = weatherMatchResult.city;
    if (weatherMatchResult.country) {
        weatherQuery += ',' + weatherMatchResult.country;
    }
    return weatherQuery.toLowerCase();
}

function toWeatherResponseMessage(weatherInfo) {
    let weather = weatherInfo.weather[0];
    const respnseText = `${weatherInfo.name}, ${weatherInfo.sys.country}: ` +
        `${weather.main} - ${weather.description}, ` +
        `temperature: ${weatherInfo.main.temp} Celsius`;
    return respnseText;
}
