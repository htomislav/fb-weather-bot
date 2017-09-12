// waits for an event to be done and returns a promise when it happens
// waiting is done by periodically checking the condition
module.exports = function (isDone) {
    return new Promise((resolve) => {
        let awaitFunc = () => {
            if (!isDone()) {
                setTimeout(awaitFunc, 100);
                return;
            }
            resolve();
        };
        awaitFunc();
    })
}

