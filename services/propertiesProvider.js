
// WEATHER_ENTRY_EXPIRATION_SECONDS check
if (!process.env.WEATHER_ENTRY_EXPIRATION_SECONDS) {
    throw Error("WEATHER_ENTRY_EXPIRATION_SECONDS is undefined")
}
var WEATHER_ENTRY_EXPIRATION_SECONDS = parseInt(process.env.WEATHER_ENTRY_EXPIRATION_SECONDS);
if (!WEATHER_ENTRY_EXPIRATION_SECONDS) {
    throw Error("WEATHER_ENTRY_EXPIRATION_SECONDS is not an integer")
}

// MONGODB_URI check
if (!process.env.MONGODB_URI) {
    throw Error("MONGODB_URI is undefined")
}

// PAGE_ACCESS_TOKEN check
if (!process.env.PAGE_ACCESS_TOKEN) {
    throw Error("PAGE_ACCESS_TOKEN is undefined")
}

// WEATHER_APP_ID check
if (!process.env.WEATHER_APP_ID) {
    throw Error("WEATHER_APP_ID is undefined")
}

// WEBHOOK_VERIFY_TOKEN check
if (!process.env.WEBHOOK_VERIFY_TOKEN) {
    throw Error("WEBHOOK_VERIFY_TOKEN is undefined")
}

module.exports = {
    WEATHER_ENTRY_EXPIRATION_SECONDS: WEATHER_ENTRY_EXPIRATION_SECONDS,
    MONGODB_URI: process.env.MONGODB_URI,
    PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
    WEATHER_APP_ID: process.env.WEATHER_APP_ID,
    WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN
}