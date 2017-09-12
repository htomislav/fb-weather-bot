module.exports = {

    // tries to match users message agains the weather regexp
    // returns match result if success, null otherwise
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
