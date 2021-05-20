const express = require('express');
const uuid = require('uuid4');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PharmecyInventorySchema = require('./schema');
const PharmecyInventory = mongoose.model('PharmacyInventory',PharmecyInventorySchema);



const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
   
};

module.exports = function (app) {
    initialize(app);
};