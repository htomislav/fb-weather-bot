module.exports = {

    match: function (message) {
        var regexpMatch = new RegExp('weather\\s([a-zA-Z]+)[,\\s]*([a-zA-Z]*).*$', 'i').exec(message);
        if (!regexpMatch) {
            return null;
        }

        var weatherMatchResult = {city: regexpMatch[1]};
        if (regexpMatch[2]) {
            weatherMatchResult.country = regexpMatch[2];
        }
        return weatherMatchResult;
    }
}
