const UserController = require('./core/controller');

const initController = function (app) {
    UserController(app);
};

module.exports = function (app) {
    initController(app);
};