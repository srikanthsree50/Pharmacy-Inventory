const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const RolesSchema = mExtender.Schema({
    RoleName: {type: String, default: "app-user"},
    ParentRoles: [{type: String, required: true}]
}, {collection: "Roles"});

module.exports = RolesSchema;