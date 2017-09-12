require('./loadEnvironmentVariables')
require('./db/db')

const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express()

// express parsing
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
// general error handler
app.use(function (err, req, res, next) {
    console.error("Internal server error", err)
    res.status(500);
})

// server
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port', port)
})

// needed for the tests
module.exports = {
    app: app,
};

// todo
// - es7


// to be done
// - better chat bot
// - improve logging
// - what does weather api block response look like?
// - expires - need to delete index! (https://stackoverflow.com/questions/14597241/setting-expiry-time-for-a-collection-in-mongodb-using-mongoose)
