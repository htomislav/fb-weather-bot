module.exports = function await(isDone) {
    return new Promise(function (resolve) {
        var awaitFunc = function () {
            if (!isDone()) {
                setTimeout(awaitFunc, 100);
                return;
            }
            resolve();
        };
        awaitFunc();
    })
}

