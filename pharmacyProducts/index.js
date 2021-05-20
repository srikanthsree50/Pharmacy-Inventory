const PharmecyProductController = require('./core/controller')

const initController = function (app) {
    PharmecyProductController(app);
};

module.exports = function (app) {
    initController(app);
};