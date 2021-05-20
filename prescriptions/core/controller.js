const express = require('express');
const uuid = require('uuid4');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PrescriptionSchema = require('./schema');
const Prescription = mongoose.model('Prescriptions',PrescriptionSchema);



const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());

};

module.exports = function (app) {
    initialize(app);
};