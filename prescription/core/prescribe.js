const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PrescribeSchema = mExtender.Schema({
    DoctorId: {type: String, required: true},
    PrescriptionId: {type: String, required: true},
    PatientId: {type: String, required: true},
    DiseaseHistory: { type: String, required: true},
    IssuedDate: {type: Date, required: true},
    NextAppointmentDate: Date,
    NextAppointmentTime: String,
    IsPrescribed: {type: Boolean, default: false}
}, {collection: "nextAppointment", versionKey: false});

module.exports = PrescribeSchema;


