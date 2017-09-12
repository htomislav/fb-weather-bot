const propertiesProvider = require('./propertiesProvider');

module.exports = {

    // verifies webhook
    verify(verificationData) {
        if (verificationData.mode === 'subscribe' &&
            verificationData.token === propertiesProvider.WEBHOOK_VERIFY_TOKEN) {
            console.log("Service validated");
            return {
                isSuccess: true,
                response: verificationData.challenge
            };
        } else {
            console.log(`Service validation failed, verify token: ${verificationData.token}`);
            return {
                isSuccess: false,
            };
        }
    }
}