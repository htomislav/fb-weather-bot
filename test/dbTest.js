require('./testSetup')
require('../loadEnvironmentVariables')

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var eventualAwait = require('./eventualAwait')
const db = require('../db/db');

describe('DB', function () {

    before(function (done) {
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

    it('Read empty collection', function (done) {
        db.findCurrentWeather("Londond,GB")
            .then(function (obj) {
                expect(obj).to.equal(null)
                done()
            })
    })

    it('Write and read entry', function (done) {
        db.updateCurrentWeather("Londond,GB", {name: "something"})
            .then(function (result) {
                expect(result).to.equal(undefined)
                return db.findCurrentWeather("Londond,GB")
            })
            .then(function (result) {
                expect(result.locationName).to.equal("Londond,GB")
                expect(result.weatherInfo).to.deep.equal({name: "something"})
                done()
            });
    })

    it('Write and update entry', function (done) {
        db.updateCurrentWeather("Londond,GB", {name: "something"})
            .then(function (result) {
                expect(result).to.equal(undefined)
                return db.updateCurrentWeather("Londond,GB", {name: "something else"})

            })
            .then(function (result) {
                expect(result).to.equal(undefined)
                return db.findCurrentWeather("Londond,GB")
            })
            .then(function (result) {
                expect(result.locationName).to.equal("Londond,GB")
                expect(result.weatherInfo).to.deep.equal({name: "something else"})
                done()
            });
    })
})