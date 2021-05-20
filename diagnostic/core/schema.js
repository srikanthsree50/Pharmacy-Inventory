const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const DiagnosticSchema = mExtender.Schema({

    DiagnosticName: {type: String, required: true},
    DiagnosticLocation: {type: String, required: true},
    DiagnosticPhoneNumber:{type: String, required: true}

}, { collection: "Diagnostic" });

module.exports = DiagnosticSchema;