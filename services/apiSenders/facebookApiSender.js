const request = require('request');

const propertiesProvider = require('../propertiesProvider');

module.exports = {

    // sends message responses to Facebook Send API
    send(messageData) {
        return new Promise((resolve, reject) => {
            request({
                uri: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {access_token: propertiesProvider.PAGE_ACCESS_TOKEN},
                method: 'POST',
                timeout: 5000,
                json: messageData
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const recipientId = body.recipient_id;
                    const messageId = body.message_id;
                    console.log(`Successfully sent generic message with id ${messageId} to recipient ${recipientId}`);
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