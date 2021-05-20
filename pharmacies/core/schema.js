const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PharmaciesSchema = mExtender.Schema({
   
    PharmacyName: {type: String, required: true},
    PharmacyLocation: {type: String, required: true},
    PharmacyOpenTime: { type: String},
    PharmacyClosingTime: { type: String},
    HomeDelivery: { type: Boolean},
    PharmacyPhoneNumber:{type: String, required: true}

}, { collection: "Pharmacies" });

module.exports = PharmaciesSchema;