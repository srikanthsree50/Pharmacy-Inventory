const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const PrescribedMedicineHistorySchema = require('./schema');
const PrescribedMedicineHistory = mongoose.model('PrescribedMedicinesHistories', PrescribedMedicineHistorySchema);