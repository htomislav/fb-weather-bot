require('./utils/testSetup')
require('../loadEnvironmentVariables')

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const eventualAwait = require('./utils/eventualAwait')
const db = require('../db/db');
const weatherDal = require('../db/weatherDal');

describe('DB', () => {

    before((done) => {
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

    it('Read empty collection', (done) => {
        weatherDal.findCurrentWeather("Londond,GB")
            .then((obj) => {
                expect(obj).to.equal(null)
                done()
            })
    })

    it('Write and read entry', (done) => {
        weatherDal.updateCurrentWeather("Londond,GB", {name: "something"})
            .then((result) => {
                expect(result).to.equal(undefined)
                return weatherDal.findCurrentWeather("Londond,GB")
            })
            .then((result) => {
                expect(result.locationName).to.equal("Londond,GB")
                expect(result.weatherInfo).to.deep.equal({name: "something"})
                done()
            });
    })

    it('Write and update entry', (done) => {
        weatherDal.updateCurrentWeather("Londond,GB", {name: "something"})
            .then((result) => {
                expect(result).to.equal(undefined)
                return weatherDal.updateCurrentWeather("Londond,GB", {name: "something else"})

            })
            .then((result) => {
                expect(result).to.equal(undefined)
                return weatherDal.findCurrentWeather("Londond,GB")
            })
            .then((result) => {
                expect(result.locationName).to.equal("Londond,GB")
                expect(result.weatherInfo).to.deep.equal({name: "something else"})
                done()
            });
    })
})