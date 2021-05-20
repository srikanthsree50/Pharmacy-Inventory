const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const UserSchema = mExtender.Schema({
    DisplayName: String,
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    UserName: {type: String},
    ProfilePicture: {type: String},
    PhoneNumber: {type: String ,unique: true},
    PhoneNumberVerified: {type: 'boolean', default: false},
    Password: {type: String, required: true},
    PublicUserId: {type: String},
}, {collection: 'Users'});

module.exports = UserSchema;
