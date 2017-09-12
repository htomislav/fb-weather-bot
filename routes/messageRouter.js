const express = require('express');
const messageService = require('../services/messageService')

module.exports = function () {
    var router = express.Router();

    router.post('', function (req, res) {
        try {
            if (messageService.process(req.body)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (err) {
            console.error("Error while processing message", err)
            res.sendStatus(500);
        }
    })

    return router;
}