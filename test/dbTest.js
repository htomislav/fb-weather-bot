require('./utils/testSetup')
require('../loadEnvironmentVariables')

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var eventualAwait = require('./utils/eventualAwait')
const db = require('../db/db');
const weatherDal = require('../db/weatherDal');

describe('DB', function () {

    before(function (done) {
        eventualAwait(function () {
            return db.isInitialized();
        })
            .then(function () {
                weatherDal.deleteAllCurrentWeathers()
                    .then(function () {
                        done();
                    })
            })
    })

    it('Read empty collection', function (done) {
        weatherDal.findCurrentWeather("Londond,GB")
            .then(function (obj) {
                expect(obj).to.equal(null)
                done()
            })
    })

    it('Write and read entry', function (done) {
        weatherDal.updateCurrentWeather("Londond,GB", {name: "something"})
            .then(function (result) {
                expect(result).to.equal(undefined)
                return weatherDal.findCurrentWeather("Londond,GB")
            })
            .then(function (result) {
                expect(result.locationName).to.equal("Londond,GB")
                expect(result.weatherInfo).to.deep.equal({name: "something"})
                done()
            });
    })

    it('Write and update entry', function (done) {
        weatherDal.updateCurrentWeather("Londond,GB", {name: "something"})
            .then(function (result) {
                expect(result).to.equal(undefined)
                return weatherDal.updateCurrentWeather("Londond,GB", {name: "something else"})

            })
            .then(function (result) {
                expect(result).to.equal(undefined)
                return weatherDal.findCurrentWeather("Londond,GB")
            })
            .then(function (result) {
                expect(result.locationName).to.equal("Londond,GB")
                expect(result.weatherInfo).to.deep.equal({name: "something else"})
                done()
            });
    })
})