const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const WorkSampleSchema = mExtender.Schema({
    UserId: {type: String},
    VideoLink: {type: String},
    Description: {type: String},
    Document: {type: String},
},{ collection: "WorkSamples", versionKey: false });

module.exports = WorkSampleSchema;