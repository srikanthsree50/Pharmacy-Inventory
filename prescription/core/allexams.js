const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const AllExams = mExtender.Schema({
    ExamName: {type: String, required: true},


}, {collection: "AllExams", versionKey: false});

module.exports = AllExams;