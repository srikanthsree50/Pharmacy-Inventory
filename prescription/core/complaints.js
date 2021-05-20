const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const ComplaintsSchema = mExtender.Schema({


    DoctorId: { type: String, required: true },
    PatientId: { type: String, required: true },
    PrescriptionId: {type: String, required: true},
    IssuedDate: { type: Date, required: true },
    Complaints: {type: String, required: true},

}, { collection: "Complaints", versionKey: false });

module.exports = ComplaintsSchema;