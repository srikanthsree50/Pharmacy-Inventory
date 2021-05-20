const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const MedicineSchema = mExtender.Schema({
    DoctorId: {type: String, required: true},
    PrescriptionId: {type: String, required: true},
    PatientId: {type: String, required: true},
    BrandName: {type: String, required: true},
    IssuedDate: {type: Date, required: true},
    IsPrescribed: {type: Boolean, default: false},
    Comments: {type: String},
    UpToDays: {type: String, default: '1-month',required: true}

}, {collection: "prescribedMedicines", versionKey: false});

module.exports = MedicineSchema;