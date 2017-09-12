const express = require('express');

const verificationService = require('../services/verificationService')

module.exports = () => {
    const router = express.Router();

    // webhook verification route
    router.get('', (req, res) => {
        let result = verificationService.verify({
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