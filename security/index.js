const SecurityController = require('./core/controller');

const initController = function (app) {
    SecurityController(app);
};


module.exports = function (app) {
    //initMiddleWare(app);
    initController(app);
};