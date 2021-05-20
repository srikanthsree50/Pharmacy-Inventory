const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const DoctorSchema = mExtender.Schema({

    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Designation: {type: String, required: true},
    Specialities: [{type : String}],
    Department: {type: String, required: true},
    PracticePlace: {type: String, required: true},
    Chambers: [{type: String}]
}, { collection: "Doctors", versionKey: false });

module.exports = DoctorSchema;