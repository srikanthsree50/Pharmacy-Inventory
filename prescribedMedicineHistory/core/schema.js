const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PrescribedMedicinesHistorySchema = mExtender.Schema({
    
   PrescribedMedicineId: { type: String, required: true },
   ProductId: { type: String, required: true },
   PatientId: { type: String, required: true },
   DoctorId: { type: String, required: true },
   OrderDate: { type: Date, required: true },
   Days: { type: 'Number', required: true }

}, { collection: "PrescribedMedicinesHistories", versionKey: false });

module.exports = PrescribedMedicinesHistorySchema;