const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PrimaryPrescriptionSchema = mExtender.Schema({
    DoctorId: { type: String, required: true },
    DoctorName: { type: String, required: true },
    PatientId: { type: String, required: true },
    IssuedDate: { type: Date, required: true },
    PatientAge: { type: String, required: true },
    PatientName: { type: String, required: true },

}, { collection: "PrimaryPrescription", versionKey: false });

module.exports = PrimaryPrescriptionSchema;