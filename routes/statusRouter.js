const express = require('express');

module.exports = function () {
    var router = express.Router();

    // service status route
    router.get('', function (req, res) {
        res.send("Service is alive");
    })

    return router;
}