const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();
const Organizations = mExtender.Schema({
    UserId: {type:String},
    OrganizationName: {type: String},
    Designation: {type: String},
    From: {type: Date},
    To: {type: Date},
}, { collection: "Organizations", versionKey: false });

module.exports = Organizations;