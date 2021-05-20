const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const AllExams = mExtender.Schema({
    DoctorId: {type: String, required: true},
    PrescriptionId: {type: String, required: true},
    PatientId: {type: String, required: true},
    IssuedDate: {type: Date, required: true},
    ExamName: {type: String, required: true},

}, {collection: "Exams", versionKey: false});

module.exports = AllExams;