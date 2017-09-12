const express = require('express');
const messageService = require('../services/messageService')

module.exports = function () {
    var router = express.Router();

    router.post('', function (req, res) {
        if (messageService.process(req.body)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    })

    return router;
}