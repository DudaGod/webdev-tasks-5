if (NODE_ENV === process.env.NODE_ENV) {
    module.exports = require('./configureStore.prod');
} else {
    module.exports = require('./configureStore.dev');
}
