const PrescriptionController = require('./core/controller')

const initController = function (app) {
    PrescriptionController(app);
};

module.exports = function (app) {
    initController(app);
};