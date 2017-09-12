require('./utils/testSetup')
const propertiesProvider = require('../services/propertiesProvider');

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const request = require("supertest-as-promised");
const nock = require('nock');
const eventualAwait = require('./utils/eventualAwait')
const app = require('../app').app;
const db = require('../db/db');
const weatherDal = require('../db/weatherDal');

const BOT_SERVICE_ID = 100000;
const FACEBOOK_SERVICE_ID = 200000;

describe('Message', () => {

    beforeEach((done) => {
        nock.cleanAll();
        eventualAwait(() => {
            return db.isInitialized();
        })
            .then(() => {
                weatherDal.deleteAllCurrentWeathers()
                    .then(() => {
                        done();
                    })
            })
    })

    it('Unknown message results in help answer', (done) => {
        const messsageText = "To search for current weather, type:\n'weather <city>,<country>'\n(<country> is optional)";
        let facebookSendApiMock = mockFacebookSendApi().expectMessage(messsageText);
        request(app)
            .post('/webhook')
            .send(createFacebookPageBody("test message"))
            .expect(200)
            .then((res) => {
                expect(res.body).to.deep.equal({})
                return eventualAwait(() => {
                    return facebookSendApiMock.isSuccessfullyCalled;
                })
            })
            .then((res) => {
                done();
            })
    }).timeout(1000);

    it('Invalid page returns HTTP 400', (done) => {
        request(app)
            .post('/webhook')
            .send({})
            .expect(400)
            .then((res) => {
                done();
            })
    }).timeout(1000);

    it('Weather query returns weather info', (done) => {
        let facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
        let weatherApiMock = mockWeatherApi()
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
            .then((res) => {
                expect(res.body).to.deep.equal({})
            })
            .then(() => {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(() => {
                done();
            })
    }).timeout(2000);

    it('Second weather query uses cache', (done) => {
        let facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
        let weatherApiMock = mockWeatherApi()
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
            .then((res) => {
                expect(res.body).to.deep.equal({})
            })
            .then(() => {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(() => {
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
                    .then((res) => {
                        expect(res.body).to.deep.equal({})
                    })
            })
            .then(() => {
                // Facebook API might be called after the response
                return eventualAwait(() => {
                    return facebookSendApiMock.nock.isDone();
                })
            })
            .then(() => {
                // delay a bit in case Weather API gets called
                return delay(2000)
            })
            .then(() => {
                done();
            })
    }).timeout(5000);

    it('Cached queries are case insensitive ', (done) => {
        let facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("London, GB: Clouds - scattered clouds, temperature: 12.34 Celsius");
        let weatherApiMock = mockWeatherApi()
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
            .then((res) => {
                expect(res.body).to.deep.equal({})
            })
            .then(() => {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(() => {
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
                    .then((res) => {
                        expect(res.body).to.deep.equal({})
                    })
            })
            .then(() => {
                // Facebook API might be called after the response
                return eventualAwait(() => {
                    return facebookSendApiMock.nock.isDone();
                })
            })
            .then(() => {
                // delay a bit in case Weather API gets called
                return delay(2000)
            })
            .then(() => {
                done();
            })
    }).timeout(5000);

    it('Weather service returns status 500', (done) => {
        let facebookSendApiMock = mockFacebookSendApi()
            .expectMessage("Weather service is temporary unavailable, please try again later");
        let weatherApiMock = mockWeatherApi()
            .expectWeatherQuery("london,uk")
            .invalidHttpStatus(500);
        request(app)
            .post('/webhook')
            .send(createFacebookPageBody("weather london, uk"))
            .expect(200)
            .then((res) => {
                expect(res.body).to.deep.equal({})
            })
            .then(() => {
                // APIs might be called after the response
                return eventualAwaitForFacebookAndWeatherMocks(facebookSendApiMock, weatherApiMock)
            })
            .then(() => {
                done();
            })
    }).timeout(2000);

})

function delay(mSec) {
    return new Promise((resolve) => {
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
    let mockObject = {
        init() {
            mockObject.nock = nock('https://graph.facebook.com')
                .post(`/v2.6/me/messages?access_token=${propertiesProvider.PAGE_ACCESS_TOKEN}`,
                    (body) => {
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
        expectMessage(messsageText) {
            this.messsageText = messsageText;
            return this;
        }
    }
    mockObject.init();
    return mockObject;
}

function mockWeatherApi() {
    let mockObject = {
        expectWeatherQuery(weatherQuery) {
            mockObject.nock = nock('http://api.openweathermap.org')
                .get(`/data/2.5/weather?q=${weatherQuery}&APPID=${propertiesProvider.WEATHER_APP_ID}&units=metric`,
                    (body) => {
                        mockObject.isSuccessfullyCalled = true;
                        return true;
                    })
            return mockObject;
        },
        weatherInfo(weatherInfo) {
            // real nock is received after the reply() call!
            mockObject.nock = mockObject.nock
                .reply(200, getWeatherData(weatherInfo));
            return mockObject;
        },
        invalidHttpStatus(httpStatus) {
            // real nock is received after the reply() call!
            mockObject.nock = mockObject.nock
                .reply(httpStatus);
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
    return eventualAwait(() => {
        return facebookSendApiMock.nock.isDone();
    })
        .then(() => {
            return eventualAwait(() => {
                return weatherApiMock.nock.isDone();
            })
        })
}