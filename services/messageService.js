const weatherMatcher = require('./weather/weatherMatcher');
const weatherMessageProcessor = require('./weather/weatherMessageProcessor');
const facebookApiSender = require('./apiSenders/facebookApiSender')

module.exports = {

    // processes messages from Facebook (synchronous method)
    // complete processing is done asynchronously after the method returns result.
    // returns true if input data looks ok, false otherwise.
    process: function (messageObject) {
        if (messageObject && messageObject.object === 'page') {
            messageObject.entry.forEach(function (entry) {
                entry.messaging.forEach(function (event) {
                    if (event.message) {
                        // process message asynchronously
                        processMessageEvent(event)
                    } else if (event.delivery) {
                        console.log("Received delivery event for", event.delivery.mids);
                    } else {
                        console.log("Received unknown event: ", event);
                    }
                });
            });
            return true;
        }
        console.log("Invalid message type", messageObject.object);
        return false;
    }
}

function processMessageEvent(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    return processMessageText(message.text)
        .then(function (responseMessage) {
            return facebookApiSender.send({
                recipient: {
                    id: senderID
                },
                message: {
                    text: responseMessage
                }
            });
        })
        .catch(function (err) {
            console.error("Error while processing message text", err)
        })
}

function processMessageText(messageText) {
    if (messageText) {
        // weather
        var weatherMatchResult = weatherMatcher.match(messageText);
        if (weatherMatchResult) {
            console.log("Weather match:", weatherMatchResult)
            return weatherMessageProcessor.process(weatherMatchResult)
                .then(function (result) {
                    if (!result) {
                        return "Weather service is temporary unavailable, please try again later";
                    }
                    return result
                })
        }
    }

    // default help message
    return Promise.resolve(
        "To search for current weather, type:\n" +
        "'weather <city>,<country>'" +
        "\n(<country> is optional)"
    );
}