const MedicineController = require('./core/controller')

const initController = function (app) {
    MedicineController(app);
};

module.exports = function (app) {
    initController(app);
};