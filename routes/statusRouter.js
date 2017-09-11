const express = require('express');

module.exports = function () {
    var router = express.Router();

    router.get('', function (req, res) {
        res.send("Service alive");
    })

    return router;
}