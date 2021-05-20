const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const EducationalQualificationSchema = mExtender.Schema({
    UserId: {type: String},
    BachelorOrEquivalentDegree: {type: String},
    MasterDegreeOrEquivalentDegree: {type: String},
    PHDOrEquivalentDegree: {type:String},

}, { collection: "EducationalQualifications", versionKey: false });

module.exports = EducationalQualificationSchema;