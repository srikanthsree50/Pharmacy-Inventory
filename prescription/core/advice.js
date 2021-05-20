const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const AdviceSchema = mExtender.Schema({


    DoctorId: { type: String, required: true },
    PatientId: { type: String, required: true },
    PrescriptionId: {type: String, required: true},
    IssuedDate: { type: Date, required: true },
    Advice: {type: String, required: true},

}, { collection: "Advices", versionKey: false });

module.exports = AdviceSchema;