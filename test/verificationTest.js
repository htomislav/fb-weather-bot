require('./utils/testSetup')
const propertiesProvider = require('../services/propertiesProvider');

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const request = require("supertest-as-promised");
const app = require('../app').app;

describe('Verification', () => {

    it('Verification with valid token passes', (done) => {
        request(app)
            .get(`/webhook?hub.mode=subscribe&hub.challenge=786761164&hub.verify_token=${propertiesProvider.WEBHOOK_VERIFY_TOKEN}`)
            .expect(200)
            .then((res) => {
                expect(res.text).to.equal('786761164')
                done();
            });
    }).timeout(1000);

    it('Verification with invalid token does not pass', (done) => {
        request(app)
            .get('/webhook?hub.mode=subscribe&hub.challenge=786761164&hub.verify_token=xxx')
            .expect(403)
            .then((res) => {
                done();
            });
    }).timeout(1000);
});
