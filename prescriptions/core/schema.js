const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PrescriptionsSchema = mExtender.Schema({


    DoctorId: { type: String, required: true },
    PatientId: { type: String, required: true },
    IssuedDate: { type: Date, required: true },
    PatientAge: { type: Number, required: true },
    NextAppointmentDate: Date,
    NextAppointmentTime: String,
    IsPrescribed: {type: Boolean, default: false}


}, { collection: "Prescriptions", versionKey: false });

module.exports = PrescriptionsSchema;