const UserRoleMapsSchema = require('./core/schema');
const controller = require('./core/controller')
const initController = function (app) {
    controller(app);
};
module.exports = function (app) {

    if (app) {
       initController(app);
    }
    return {
        UserRoleMapsSchema: UserRoleMapsSchema,
        GetUserRoles: controller().GetUserRoles,
        createUserRoles: controller().createUserRoles,
    }
};