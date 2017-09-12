const request = require('request');

const propertiesProvider = require('../propertiesProvider');

module.exports = {
    sendWeatherQuery: function (locationName) {
        return new Promise(function (resolve, reject) {
            request({
                uri: 'http://api.openweathermap.org/data/2.5/weather?q='
                + locationName
                + '&APPID=' + propertiesProvider.WEATHER_APP_ID
                + '&units=metric',
                method: 'GET',
                timeout: 5000,
                json: true
            }, function (error, response, body) {
                if (!error) {
                    if (response.statusCode == 200) {
                        console.log("Successfully queried weather API for", locationName)
                        resolve(body);
                    } else {
                        console.error("Weather service response was not regular, HTTP status", response.statusCode, "body:", body);
                        resolve()
                    }
                } else {
                    console.error("Unable to send message to weather service.");
                    console.error("Response", response);
                    console.error("Error", error);
                    reject(error);
                }
            });
        })
    }
}