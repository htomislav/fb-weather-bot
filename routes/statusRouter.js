const express = require('express');

module.exports = () => {
    const router = express.Router();

    // service status route
    router.get('', (req, res) => {
        res.send("Service is alive");
    })

    return router;
}