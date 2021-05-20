const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const UserRoleMapsSchema = new mExtender.Schema({

    TenantId: {type: String, required: true},
    UserId: {type: String, required: true, max: 36},
    RoleName: {type: String, required: true},

}, {collection: 'UserRoleMaps',versionKey: false});


module.exports = UserRoleMapsSchema;
