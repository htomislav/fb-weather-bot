require('./utils/testSetup')

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var request = require("supertest-as-promised");
var nock = require('nock');
var eventualAwait = require('./utils/eventualAwait')
var app = require('../app').app;
const db = require('../db/db');

const BOT_SERVICE_ID = 100000;
const FACEBOOK_SERVICE_ID = 200000;

describe('Message', function () {

    beforeEach(function (done) {
        nock.cleanAll();
        eventualAwait(function () {
            return db.isInitialized;
        })
            .then(function () {
                db.deleteAllCurrentWeathers()
                    .then(function () {
                        done();
                    })
            })
    })

    it('Unknown message results in help answer', function (done) {
        const messsageText = "To search for current weather, type:\n'weather <city>,<country>'\n(<country> is optional)";
        var facebookSendApiMock = mockFacebookSendApi().expectMessage(messsageText);
        request(app)
            .post('/webhook')
            .send(createFacebookPageBody("test message"))
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal({})
                return eventualAwait(function () {
                    return facebookSendApiMock.isSuccessfullyCalled;
                })
            })
            .then(function (res) {
                done();
            })
    }).timeout(1000);

    it('Invalid page returns HTTP 400', function (done) {
        request(app)
            .post('/webhook')
            .send({})
            .expect(400)
            .then(function (res) {
                done();
            })
    }).timeout(1000);

    it('Weather query returns weather info', function (done) {
        var facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
        var weatherApiMock = mockWeatherApi()
            .expectWeatherQuery("london,uk")
            .weatherInfo({
                mainWeather: "Clouds",
                descriptionWeather: "scattered clouds",
                temp: "12.34",
                cityName: "London",
                country: "GB",
            });
        request(app)
            .post('/webhook')
            .send(createFacebookPageBody("weather london, uk"))
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal({})
            })
            .then(function () {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(function () {
                done();
            })
    }).timeout(2000);

    it('Second weather query uses cache', function (done) {
        var facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
        var weatherApiMock = mockWeatherApi()
            .expectWeatherQuery("london,uk")
            .weatherInfo({
                mainWeather: "Clouds",
                descriptionWeather: "scattered clouds",
                temp: "12.34",
                cityName: "London",
                country: "GB",
            });
        // Send the first query (this one should call Weather API)
        request(app)
            .post('/webhook')
            .send(createFacebookPageBody("weather london, uk"))
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal({})
            })
            .then(function () {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(function () {
                // restart the API mocks
                nock.cleanAll();
                facebookSendApiMock = mockFacebookSendApi()
                    .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
                // this should not be called (if called, assertions will fail)
                weatherApiMock = mockWeatherApi()
                    .expectWeatherQuery("london,uk")
                    .weatherInfo({
                        mainWeather: "xxx",
                        descriptionWeather: "xxx",
                        temp: "xxx",
                        cityName: "London",
                        country: "GB",
                    });
                // Send the second query (this one should NOT call
                // the Weather API, it should use cache instead)
                return request(app)
                    .post('/webhook')
                    .send(createFacebookPageBody("weather london, uk"))
                    .expect(200)
                    .then(function (res) {
                        expect(res.body).to.deep.equal({})
                    })
            })
            .then(function () {
                // Facebook API might be called after the response
                return eventualAwait(function () {
                    return facebookSendApiMock.nock.isDone();
                })
            })
            .then(function () {
                // delay a bit in case Weather API gets called
                return delay(2000)
            })
            .then(function () {
                done();
            })
    }).timeout(5000);

    it('Cached queries are case insensitive ', function (done) {
        var facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
        var weatherApiMock = mockWeatherApi()
            .expectWeatherQuery("london,uk")
            .weatherInfo({
                mainWeather: "Clouds",
                descriptionWeather: "scattered clouds",
                temp: "12.34",
                cityName: "London",
                country: "GB",
            });
        // Send the first query (this one should call Weather API)
        request(app)
            .post('/webhook')
            .send(createFacebookPageBody("weather london, uk"))
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal({})
            })
            .then(function () {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(function () {
                // restart the API mocks
                nock.cleanAll();
                facebookSendApiMock = mockFacebookSendApi()
                    .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
                // Weather API should not be called (if called, assertions will fail)
                weatherApiMock = mockWeatherApi()
                    .expectWeatherQuery("london,uk")
                    .weatherInfo({
                        mainWeather: "xxx",
                        descriptionWeather: "xxx",
                        temp: "xxx",
                        cityName: "London",
                        country: "GB",
                    });
                // Send the second query with capital case (this one should NOT call
                // the Weather API, it should use cache instead)
                return request(app)
                    .post('/webhook')
                    .send(createFacebookPageBody("weather LONDON, uk"))
                    .expect(200)
                    .then(function (res) {
                        expect(res.body).to.deep.equal({})
                    })
            })
            .then(function () {
                // Facebook API might be called after the response
                return eventualAwait(function () {
                    return facebookSendApiMock.nock.isDone();
                })
            })
            .then(function () {
                // delay a bit in case Weather API gets called
                return delay(2000)
            })
            .then(function () {
                done();
            })
    }).timeout(5000);

})

function delay(mSec) {
    return new Promise(function (resolve) {
        setTimeout(resolve, mSec)
    });
}

function createFacebookPageBody(messageText) {
    return {
        object: 'page',
        entry: [
            {
                messaging: [
                    {
                        sender: {
                            id: FACEBOOK_SERVICE_ID
                        },
                        recipient: {
                            id: BOT_SERVICE_ID
                        },
                        timestamp: 123456789,
                        message: {
                            text: messageText
                        }
                    }
                ]
            }
        ]
    };
}

function mockFacebookSendApi() {
    var mockObject = {
        init: function () {
            mockObject.nock = nock('https://graph.facebook.com')
                .post('/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN, function (body) {
                    expect(body.recipient.id).to.equal(FACEBOOK_SERVICE_ID)
                    expect(body.message.text).to.equal(mockObject.messsageText)
                    mockObject.isSuccessfullyCalled = true;
                    return true;
                })
                .reply(200, {
                    recipient_id: FACEBOOK_SERVICE_ID,
                    message_id: 987654321
                });
        },
        expectMessage: function (messsageText) {
            this.messsageText = messsageText;
            return this;
        }
    }
    mockObject.init();
    return mockObject;
}

function mockWeatherApi() {
    var mockObject = {
        expectWeatherQuery: function (weatherQuery) {
            mockObject.nock = nock('http://api.openweathermap.org')
                .get('/data/2.5/weather?q=' + weatherQuery + '&APPID=' + process.env.WEATHER_APP_ID + "&units=metric", function (body) {
                    mockObject.isSuccessfullyCalled = true;
                    return true;
                })
            return mockObject;
        },
        weatherInfo: function (weatherInfo) {
            // real nock is received after the reply() call!
            mockObject.nock = mockObject.nock
                .reply(200, getWeatherData(weatherInfo));
            return mockObject;
        }
    }
    return mockObject;
}


function getWeatherData(weatherInfo) {
    return {
        coord: {
            lon: -0.13,
            lat: 51.51
        },
        weather: [
            {
                id: 802,
                main: weatherInfo.mainWeather,
                description: weatherInfo.descriptionWeather,
                icon: "03n"
            }
        ],
        base: "stations",
        main: {
            temp: weatherInfo.temp,
            pressure: 1001,
            humidity: 87,
            temp_min: 284.15,
            temp_max: 286.15
        },
        visibility: 10000,
        wind: {
            speed: 3.1,
            deg: 290
        },
        clouds: {
            all: 48
        },
        dt: 1504990200,
        sys: {
            type: 1,
            id: 5093,
            message: 0.0381,
            country: weatherInfo.country,
            sunrise: 1504934845,
            sunset: 1504981589
        },
        id: 2643743,
        name: weatherInfo.cityName,
        cod: 200
    }
}

function eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock) {
    return eventualAwait(function () {
        return facebookSendApiMock.nock.isDone();
    })
        .then(function () {
            return eventualAwait(function () {
                return weatherApiMock.nock.isDone();
            })
        })
}