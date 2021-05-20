const ChambersController = require('./core/controller')

const initController = function (app) {
    ChambersController(app);
};

module.exports = function (app) {
    initController(app);
};