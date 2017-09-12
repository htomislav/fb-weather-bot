const request = require('request');

const propertiesProvider = require('../propertiesProvider');

module.exports = {

    // sends message responses to Facebook Send API
    send: function (messageData) {
        return new Promise(function (resolve, reject) {
            request({
                uri: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {access_token: propertiesProvider.PAGE_ACCESS_TOKEN},
                method: 'POST',
                timeout: 5000,
                json: messageData
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var recipientId = body.recipient_id;
                    var messageId = body.message_id;
                    console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
                    resolve()
                } else {
                    console.error("Unable to send message to Facebook Send API.");
                    console.error(response);
                    console.error(error);
                    reject(error)
                }
            });
        });
    }
}