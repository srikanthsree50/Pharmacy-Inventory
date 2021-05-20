const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PersonSchema = new mExtender.Schema({

    UserId: {type: String, required: true, max: 36},
    FullName: {type: String, required: true},
    PrimaryContact: {type: String, required: true},
    SecondaryContact: {type: String},
    Gender: {type: String},
    PrimaryEmail: {type: String},
    SecondaryEmail: {type: String},
    BloodGroup: { type: String},
    Website: {type: String},
    FacebookId: {type: String},
    TwitterId: {type: String},
    LinkedInId: {type: String},
    Roles: [{type: String}],
    Location: {type: String},
    Skills: {type: String},
    Language: {type: String},
    Industry: {type: String},
    Nationality: {type: String},
    Address: {type: String},
    DateOfBirth: {type: Date},
    About: {type: String},
}, {collection: 'Persons'});


module.exports = PersonSchema;