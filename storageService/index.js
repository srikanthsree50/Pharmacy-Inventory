const StorageService = require('./core/controller')

const initController = function (app) {
    StorageService(app);
};

module.exports = function (app) {
    initController(app);
};