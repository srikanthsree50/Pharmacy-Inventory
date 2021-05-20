const DoctorController = require('./core/controller')

const initController = function (app) {
    DoctorController(app);
};

module.exports = function (app) {
    initController(app);
};