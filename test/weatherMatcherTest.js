require('./utils/testSetup')

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const weatherMatcher = require('../services/weather/weatherMatcher');

describe('Message', () => {

    it("Test 'weather london,uk'", (done) => {
        const match = weatherMatcher.match("weather london,uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weaTher london,uk'", (done) => {
        const match = weatherMatcher.match("weaTher london,uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather london, uk'", (done) => {
        const match = weatherMatcher.match("weather london, uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather london'", (done) => {
        const match = weatherMatcher.match("weather london");
        expect(match).to.deep.equal({city: "london"})
        done();
    });

    it("Test 'weather london,'", (done) => {
        const match = weatherMatcher.match("weather london");
        expect(match).to.deep.equal({city: "london"})
        done();
    });

    it("Test 'weather london ,  uk'", (done) => {
        const match = weatherMatcher.match("weather london ,  uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather '", (done) => {
        const match = weatherMatcher.match("weather ");
        expect(match).to.deep.equal(null)
        done();
    });

    it("Test 'weather london, uk '", (done) => {
        const match = weatherMatcher.match("weather london, uk ");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather london, uk ....'", (done) => {
        const match = weatherMatcher.match("weather london, uk ....");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    // todo - fix this
    // it("Test 'weaTher london,uk'", (done) => {
    //     const match = weatherMatcher.match("weaTher lon4don,uk");
    //     expect(match).to.deep.equal({city: "london", country: "uk"})
    //     done();
    // });

});

