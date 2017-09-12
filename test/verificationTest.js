require('./utils/testSetup')
const propertiesProvider = require('../services/propertiesProvider');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var request = require("supertest-as-promised");
var app = require('../app').app;

describe('Verification', function () {

    it('Verification with valid token passes', function (done) {
        request(app)
            .get('/webhook?hub.mode=subscribe&hub.challenge=786761164&hub.verify_token=' + propertiesProvider.WEBHOOK_VERIFY_TOKEN)
            .expect(200)
            .then(function (res) {
                expect(res.text).to.equal('786761164')
                done();
            });
    }).timeout(1000);

    it('Verification with invalid token does not pass', function (done) {
        request(app)
            .get('/webhook?hub.mode=subscribe&hub.challenge=786761164&hub.verify_token=xxx')
            .expect(403)
            .then(function (res) {
                done();
            });
    }).timeout(1000);
});
