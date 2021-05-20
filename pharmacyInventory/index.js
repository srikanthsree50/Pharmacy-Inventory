const PharmecyInventoryController = require('./core/controller')

const initController = function (app) {
    PharmecyInventoryController(app);
};

module.exports = function (app) {
    initController(app);
};