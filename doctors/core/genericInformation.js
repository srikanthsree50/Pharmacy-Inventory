const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();
const GenericInformationSchema = mExtender.Schema({
    ProfileImage: {type: String},
    UserId: {type: String},
    FirstName: {type: String, maxLength: 60},
    MiddleName: {type: String, maxLength: 60},
    LastName: {type: String, maxLength: 60},
    Gender: {type: String},
    Nationality: {type: String},
    DateOfBirth: {type: Date},
    CurrentLocation: {type: String},
    Country: {type: String},
    City: {type: String},
    AboutMe: {type: String},
    PrimaryMobile: {type: String},
    SecondaryMobile: {type: String},
    PrimaryEmail: {type: String},
    SecondaryEmail: {type: String},
    PersonalWebsite: {type: String},
    Resume: {type: String},

}, { collection: "GenericInformations", versionKey: false });

module.exports = GenericInformationSchema;