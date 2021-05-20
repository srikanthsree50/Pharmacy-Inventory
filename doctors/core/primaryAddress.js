const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PrimaryAddressSchema = mExtender.Schema({
    UserId: {type: String},
    ApartmentOrSuiteOrOther: {type: String, maxLength: 200},
    Street: {type: String, maxLength: 200},
    City: {type: String, maxLength: 200},
    Country: {type: String},
    ZipCode: {type: Number},
    State: {type: String},
    SetAsPrimary: {type: Boolean}

},{ collection: "PrimaryAddresses", versionKey: false });

module.exports = PrimaryAddressSchema;