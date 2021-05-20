const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const SecondaryAddressSchema = mExtender.Schema({

    UserId: {type: String},
    ApartmentOrSuiteOrOther: {type: String, maxLength: 200},
    Street: {type: String, maxLength: 200},
    State: {type: String},
    City: {type: String, maxLength: 200},
    Country: {type: String},
    ZipCode: {type: Number},
}, {collection: "SecondaryAddresses", versionKey: false});

module.exports = SecondaryAddressSchema;