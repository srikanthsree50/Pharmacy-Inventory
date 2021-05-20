const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PersonalExperienceSchema = mExtender.Schema({
    UserId: {type: String},
    MedicalName: {type: String, maxLength: 150},
    JobTitle: {type: String, maxLength: 60},
    Skills: [{type: String}],
    Location: {type: String},
    From: {type: String},
    UpTo: {type: String},

},{ collection: "PersonalExperiences", versionKey: false });

module.exports = PersonalExperienceSchema;