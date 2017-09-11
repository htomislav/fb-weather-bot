
if (!process.env.WEBHOOK_VERIFY_TOKEN) {
    throw Error("WEBHOOK_VERIFY_TOKEN undefined")
}

module.exports = {
    verify: function (verificationData) {
        if (verificationData.mode === 'subscribe' &&
            verificationData.token === process.env.WEBHOOK_VERIFY_TOKEN) {
            console.log("Service validated");
            return {
                isSuccess: true,
                response: verificationData.challenge
            };
        } else {
            console.log(
                "Service validation failed, verify token:", verificationData.token);
            return {
                isSuccess: false,
            };
        }
    }
}