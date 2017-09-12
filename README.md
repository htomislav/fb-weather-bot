# fb-weather-bot

*Fb-weather-bot* is a Facebook Messanger bot service that provides information about the weather. It integrates with the [Facebook Messanger Platform] and the [OpenWeatherMap] to provide current weather information to the Messanger users.

# How it works

*Fb-weather-bot* exposes a webhook interface in order to receive messages from the Facebook Messanger. Each message that a user sends from the Messanger is sent to the *fb-weather-bot* where it is appropriately processed. If the message matches against the message weather pattern, OpenWeatherMap service will be queried for the current weather for the specified location. The result is then sent back to the Messanger which will be shown to the user as a result.

![alt text](/docs/Overview.png)

# Prerequisites

## Facebook integration

For detail steps please follow [Facebook Bot Setup]. Basically, you need to:
  - add a new Facebook App 
  - setup your webhook URL and specify a verification token so Facebook can verify the webhook service
  - create a Facebook Page and get a Page token - this token will be used for sending response messages to the Messanger
  - subscribe the Facebook App to the Facebook Page
    
## OpenWeatherMap integration

You need an OpenWeatherMap service token which is used when querying the service API. You can get the key [here](http://openweathermap.org/appid).

# Service details

The service is a node.js express application. It exposes the following paths:
  - */webhook* (GET) - used for webhook verification
  - */webhook* (POST) - used for receiving messages from the Facebook
  - */* (GET) - shows service status

The main service responsibility is to receive messages from the Facebook Messanger and respond with the appropriate information.
When a Facebook message is received, it is first checked if the request is valid (if it has all the necessary data). If so, HTTP status *200* is returned but message processing is done later (asynchronously). 

## Input message format
Input message (from the Facebook) has to match this criteria to be identified as a proper request:
> **weather** *`<city>`*,*`<country code>`*

For example:
> **weather** London,UK

City and country are case insensitive so this is treated as the same message:
> **weather** LONDON,uk

Country code is optional (in this case OpenWeatherMap service will decide which country the place belongs to):
> **weather** London

If the input message matches the criteria, the OpenWeatherMap service is queried for the current weather info. 

## Weather service API constraint

OpenWeatherMap service has certain constraints regarding the request rate towards its API. Since weather does not often change, requests for a certain place are allowed only every 10 minutes. 

### Caching

For this reason, *fb-weather-bot* caches weather data by using [MongoDB]. 

When a weather info for a new place is received from the weather service, it is cached and all subsequent queries for the same place are read from the cache. 

Entries are automatically removed by MongoDB after a certain expiration period (which can be set as a service property).

## Messanger response 

The weather service info is quite detailed and only a smaller part of it is returned as a Messanger response. 


This is an example of a weather message sent back to the Messanger:

> London, UK: Rain - light rain, temperature: 13.94 Celsius

If the input message cannot be matched as valid, help message will be sent back instead:

> To search for current weather, type: `'weather <city>,<country>'` (`<country>` is optional)

Messanger responses are provided in asynchronous fashion. This means that *fb-weather-bot* service sends requests containing weather message info to the Messanger API at some later time (and not immediately when it receives a request from the Messanger). 

# System properties

The service exposes the following environment variables:

> *WEATHER_ENTRY_EXPIRATION_SECONDS* - how much time (in seconds) until weather info is removed from the cache

> WEBHOOK_VERIFY_TOKEN - token used when Facebook App verifies the service

> *PAGE_ACCESS_TOKEN* - token used for contacting Facebook API

> *WEATHER_APP_ID* - ID used for contacting OpenWeatherMap API

> *MONGODB_URI* - MongoDB connection string (automatically provided when hosted on [Heroku])

> *ENV_FILE_LOCATION* - specifies *.env* file location

*NOTE - when changing WEATHER_ENTRY_EXPIRATION_SECONDS parameter, be sure to recreate the expiration index in the MongoDB, otherwise the change will not have any effect - see [this](https://stackoverflow.com/questions/14597241/setting-expiry-time-for-a-collection-in-mongodb-using-mongoose).* 

Environment variables can be read from the *.env* file located in the project root (or anywhere else where *ENV_FILE_LOCATION* references)

# Tests

> $ npm test

# TODO list

These are the things that could be done further:

 - improve chat bot - add support for the weather forecast etc.
 - improve Messanger responses to include HTML - only plain text is used
 - improve logging - currently, console.log is used
 - what does the OpenWeatherMap block response look like (when the request rate is too high) - I could not get this from the service as it apparently allows many requests one after another   
 - automate changing WEATHER_ENTRY_EXPIRATION_SECONDS - currently expiration index needs to be delete manually 

   [Facebook Messanger Platform]: <https://developers.facebook.com/docs/messenger-platform>
   [OpenWeatherMap]: <https://openweathermap.org>
   [Facebook Bot Setup]: <https://developers.facebook.com/docs/messenger-platform/guides/setup>
   [MongoDB]: <https://www.mongodb.com/>
   [Heroku]: https://dashboard.heroku.com/
