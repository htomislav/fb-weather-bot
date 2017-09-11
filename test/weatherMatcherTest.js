require('./testSetup')

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

const weatherMatcher = require('../services/weatherMatcher');

describe('Message', function () {

    it("Test 'weather london,uk'", function (done) {
        var match = weatherMatcher.match("weather london,uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weaTher london,uk'", function (done) {
        var match = weatherMatcher.match("weaTher london,uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather london, uk'", function (done) {
        var match = weatherMatcher.match("weather london, uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather london'", function (done) {
        var match = weatherMatcher.match("weather london");
        expect(match).to.deep.equal({city: "london"})
        done();
    });

    it("Test 'weather london,'", function (done) {
        var match = weatherMatcher.match("weather london");
        expect(match).to.deep.equal({city: "london"})
        done();
    });

    it("Test 'weather london ,  uk'", function (done) {
        var match = weatherMatcher.match("weather london ,  uk");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather '", function (done) {
        var match = weatherMatcher.match("weather ");
        expect(match).to.deep.equal(null)
        done();
    });

    it("Test 'weather london, uk '", function (done) {
        var match = weatherMatcher.match("weather london, uk ");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    it("Test 'weather london, uk ....'", function (done) {
        var match = weatherMatcher.match("weather london, uk ....");
        expect(match).to.deep.equal({city: "london", country: "uk"})
        done();
    });

    // todo - fix this
    // it("Test 'weaTher london,uk'", function (done) {
    //     var match = weatherMatcher.match("weaTher lon4don,uk");
    //     expect(match).to.deep.equal({city: "london", country: "uk"})
    //     done();
    // });

});

