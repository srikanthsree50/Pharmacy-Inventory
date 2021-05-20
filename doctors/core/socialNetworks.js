const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const DoctorNetworksSchema = mExtender.Schema({
    UserId: {type: String},
    Facebook: {type: String},
    Twitter: {type: String},
    LinkedIn: {type: String},
}, {collection: "SocialNetworks", versionKey: false});

module.exports = DoctorNetworksSchema;