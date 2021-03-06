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
app.use((req, res, next) => {
    console.log("\n\nREQ:", req.originalUrl, req.method, req.query, JSON.stringify(req.body, null, 4));
    return next();
});

// routes
app.use('/', require('./routes/statusRouter')());
app.use('/webhook', require('./routes/verificationRouter')());
app.use('/webhook', require('./routes/messageRouter')());
// general error handler
app.use((err, req, res, next) => {
    console.error(`Internal server error ${err}`)
    res.status(500);
})

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

// needed for the tests
module.exports = {
    app: app,
};