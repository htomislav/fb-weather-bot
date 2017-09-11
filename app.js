require('./loadEnvironmentVariables')

const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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
app.use('/', require('./routes/statusRouter')());
app.use('/webhook', require('./routes/verificationRouter')());
app.use('/webhook', require('./routes/messageRouter')());

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port', port)
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
// - env variable service
// - expires - need to delete index! (