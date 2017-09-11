require('./loadEnvironmentVariables')

const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./db/db');

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// request logging
app.use(function (req, res, next) {
    console.log("\n\nREQ:", req.originalUrl, req.method, req.query, JSON.stringify(req.body, null, 4));
    return next();
});

// routes
app.use('/webhook', require('./routes/verificationRouter')());
app.use('/webhook', require('./routes/messageRouter')());

// todo - use properties for port and host
app.listen(3000, function () {
    console.log('App listening on port 3000')
})


// needed for the tests
module.exports = {
    app: app,
};

// todo
// - logging
// - handle exceptions in routers
// - es7
// - what does weather api block response look like?
// - add time of query to msg response
// - add new lines to msg response
// - add service version to route
// - package.json: dev dependencies, repository
// - comments
// - remove secret constants
// - dev mode