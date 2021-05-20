const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const ChambersInfoSchema = mExtender.Schema({
    UserId: {type: String},
    ChamberName: {type: String, maxLength: 60},
    Address: {type: String},
    Website: {type: String},
    PhoneNumber: {type: String},
    RegistrationDocumentPath: {type: String},
}, { collection: "Chambers", versionKey: false });

module.exports = ChambersInfoSchema;