const express = require('express');
const messageService = require('../services/messageService')
const facebookSendApiService = require('../services/facebookSendApiService')

module.exports = function () {
    var router = express.Router();

    router.post('', function (req, res) {
        var data = req.body;
        if (data && data.object === 'page') {
            data.entry.forEach(function (entry) {
                entry.messaging.forEach(function (event) {
                    if (event.message) {
                        handleMessageEvent(event) // todo - async call?
                    } else if (event.delivery) {
                        console.log("Received delivery event for", event.delivery.mids);
                    } else {
                        console.log("Received unknown event: ", event);
                    }
                });
            });
            // todo - assume all is well?
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    })

    // todo - do not let router to call facebook api
    function handleMessageEvent(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;
        console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        return messageService.process(message.text)
            .then(function (responseMessage) {
                return facebookSendApiService.send({
                    recipient: {
                        id: senderID
                    },
                    message: {
                        text: responseMessage
                    }
                });
            })
    }

    return router;
}