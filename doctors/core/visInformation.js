const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();
const VisaInformationSchema = mExtender.Schema({
    UserId: {type: String},
    WillingToGo: {type: Boolean},
    Country: {type: String},
    ExpiryDate: {type: Date},
    VisaType: {type: String},

}, { collection: "VisaInformation", versionKey: false });

module.exports = VisaInformationSchema;