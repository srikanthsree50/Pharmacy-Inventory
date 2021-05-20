const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const MedicineSchema = mExtender.Schema({
    BrandName: {type: String, required: true},
    Category: {type: String},
    GenericName: {type: String, required: true},
    Unit: {type: String, required: true},
    DoseForm: {type: String,required: true},
}, {collection: "Medicines", versionKey: false});

module.exports = MedicineSchema;