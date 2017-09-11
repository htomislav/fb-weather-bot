const express = require('express');

if (!process.env.WEBHOOK_VERIFY_TOKEN) {
    throw Error("WEBHOOK_VERIFY_TOKEN undefined")
}

module.exports = function () {
    var router = express.Router();

    router.get('',
        function (req, res) {
            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === process.env.WEBHOOK_VERIFY_TOKEN) {
                console.log("Service validated");
                res.status(200).send(req.query['hub.challenge']);
            } else {
                console.log(
                    "Service validation failed, verify token:", req.query['hub.verify_token']);
                res.sendStatus(403);
            }
        });

    return router;
}