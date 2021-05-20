const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();
const AwardsSchema = mExtender.Schema({
    UserId: {type: String},
    Name: {type: String, maxLength: 60},
    Company: {type: String},
    Description: {type: String, maxLength: 300},
    Year: {type: Date},

}, { collection: "Awards", versionKey: false });

module.exports = AwardsSchema;