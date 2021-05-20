const RolesController = require('./core/controller');

const initController = function (app) {
    RolesController(app);
};

module.exports = function (app) {
    initController(app);
};