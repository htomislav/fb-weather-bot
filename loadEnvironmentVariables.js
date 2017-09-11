if (process.env.ENV_FILE_LOCATION) {
    console.log("Loading environment variables from", process.env.ENV_FILE_LOCATION)
    require('dotenv').config({path: process.env.ENV_FILE_LOCATION})
} else {
    console.log("Loading environment variables from root")
    require('dotenv').config()
}
