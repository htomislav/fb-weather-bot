const mongoose = require('mongoose');
const Promise = require('bluebird');
const propertiesProvider = require('../services/propertiesProvider');
const weatherDal = require('./weatherDal');

// tell mongoose to use bluebird promises
mongoose.Promise = Promise;

let isDbInitialized = false;

// connect to MongoDB and initialize mongoose schemas
mongoose.connect(propertiesProvider.MONGODB_URI, {useMongoClient: true})
    .then(() => {
        console.log('Connected to MongoDB');
        weatherDal.init();
        isDbInitialized = true;
        console.log('Db layer initialized');
    })

module.exports = {
    isInitialized() {
        return isDbInitialized;
    }
};