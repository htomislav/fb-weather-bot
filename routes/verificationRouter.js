const express = require('express');

const verificationService = require('../services/verificationService')

module.exports = function () {
    var router = express.Router();

    router.get('',
        function (req, res) {
            var result = verificationService.verify({
                mode: req.query['hub.mode'],
                token: req.query['hub.verify_token'],
                challenge: req.query['hub.challenge']
            })

            if (result.isSuccess) {
                res.status(200).send(result.response);
            } else {
                res.sendStatus(403);
            }
        });

    return router;
}