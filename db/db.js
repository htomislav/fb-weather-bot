const mongoose = require('mongoose');
const Promise = require('bluebird');
const propertiesProvider = require('../services/propertiesProvider');
const weatherDal = require('./weatherDal');

// tell mongoose to use bluebird promises
mongoose.Promise = Promise;

var isDbInitialized = false;

mongoose.connect(propertiesProvider.MONGODB_URI)
    .then(function () {
        console.log('Connected to MongoDB');
        weatherDal.init();
        isDbInitialized = true;
        console.log('Db layer initialized');
    })

module.exports = {
    isInitialized: function () {
        return isDbInitialized;
    }
};