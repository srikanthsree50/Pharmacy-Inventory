const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const PrescribedMedicineSchema = require('./schema');
const PrescribedMedicine = mongoose.model('Pharmacies', PrescribedMedicineSchema);