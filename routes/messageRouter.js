const express = require('express');
const messageService = require('../services/messageService')

module.exports = () => {
    const router = express.Router();

    // webhook's message processing route
    router.post('', (req, res) => {
        if (messageService.process(req.body)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    })

    return router;
}