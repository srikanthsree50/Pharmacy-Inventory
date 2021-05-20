const authMiddleWare = require('./core/security.auth.middleware');
const accessControlOriginMiddleware = require('./core/security.origin.middleware');

const initMiddleWares = function (app) {
    accessControlOriginMiddleware(app);
    authMiddleWare(app);
};

module.exports = function (app) {
    initMiddleWares(app);
};