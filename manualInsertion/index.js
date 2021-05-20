const controller = require('./core/controller');

const initController = function (app) {
    controller(app);
};

module.exports = function (app) {
    initController(app);
};