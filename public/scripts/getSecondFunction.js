function getCurrentSecond() {
    const now = new Date();
    const currentSecond = now.getSeconds();
    return parseInt(currentSecond);
}

module.exports = getCurrentSecond;