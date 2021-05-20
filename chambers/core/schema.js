const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const ChamberSchema = mExtender.Schema({

    Address: {type: String},
    COntacts: [{type: String}],
    ConsultingHour: {type: String}
}, { collection: "Chambers", versionKey: false });

module.exports = ChamberSchema;