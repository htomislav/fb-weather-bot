require('./testSetup')

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var request = require("supertest-as-promised");
var app = require('../app').app;

describe('Verification', function () {

    it('Verification with valid token passes', function (done) {
        request(app)
            .get('/webhook?hub.mode=subscribe&hub.challenge=786761164&hub.verify_token=' + process.env.WEBHOOK_VERIFY_TOKEN)
            .expect(200)
            .then(function (res) {
                expect(res.text).to.equal('786761164')
                done();
            });
    }).timeout(1000);

    it('Verification with invalid valid does not pass', function (done) {
        request(app)
            .get('/webhook?hub.mode=subscribe&hub.challenge=786761164&hub.verify_token=xxx')
            .expect(403)
            .then(function (res) {
                done();
            });
    }).timeout(1000);
});
