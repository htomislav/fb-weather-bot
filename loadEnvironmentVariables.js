// Loads environment variables from the .env file.
// If environment variable ENV_FILE_LOCATION is set, environment variables will be loaded from the specified location
// otherwise environment variables will be loaded from the project root

if (process.env.ENV_FILE_LOCATION) {
    console.log("Loading environment variables from", process.env.ENV_FILE_LOCATION)
    require('dotenv').config({path: process.env.ENV_FILE_LOCATION})
} else {
    console.log("Loading environment variables from root")
    require('dotenv').config()
}
