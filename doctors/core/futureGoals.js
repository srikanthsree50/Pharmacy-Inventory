const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const FutureGoalsSchema = mExtender.Schema({
    UserId: {type: String},
    CourseName: {type: String},
    From: {type: Date},
    To: {type: Date},
}, {collection: "FutureGoals", versionKey: false});

module.exports = FutureGoalsSchema;