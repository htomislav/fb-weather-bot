const weatherMatcher = require('./weatherMatcher');
const weatherMessageProcessor = require('./weatherMessageProcessor');

const HELP_MESSAGE = "To search for current weather, type:\n'weather <city>,<country>'\n(<country> is optional)";

module.exports = {

    process: function (message) {
        if (message) {
            var weatherMatchResult = weatherMatcher.match(message);
            if (weatherMatchResult) {
                console.log("Weather match:", weatherMatchResult)
                return weatherMessageProcessor.process(weatherMatchResult);
            }

            return Promise.resolve(HELP_MESSAGE);
        }
    }
}