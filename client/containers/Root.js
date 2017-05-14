if (NODE_ENV === process.env.NODE_ENV) {
    module.exports = require('./Root.prod');
} else {
    module.exports = require('./Root.dev');
}
