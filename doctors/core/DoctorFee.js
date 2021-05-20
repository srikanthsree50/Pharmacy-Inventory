const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const DoctorFeeSchema = mExtender.Schema({
    UserId: {type: String},
    Specialities: {type: String, required: true},
    Currency: {type: String},
    FirstTimeFee: {type: Number},
    RevisitFee: {type: Number},
},{ collection: "DoctorFees", versionKey: false });

module.exports = DoctorFeeSchema;