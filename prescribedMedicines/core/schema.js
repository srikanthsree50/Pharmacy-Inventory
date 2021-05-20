const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PrescribedMedicinesSchema = mExtender.Schema({

    ProductId: { type: String, required: true },
    PrescriptionId: { type: String, required: true },
    ProductId: { type: String, required: true },
    TakingTimes: { type: String, required: true },
    After: 'boolean',
    Before: 'boolean',
    Days: { type: 'Number', required: true },
    Comment: String,
    ItemOrder: String
}, { collection: "PrescribedMedicines", versionKey: false });

module.exports = PrescribedMedicinesSchema;