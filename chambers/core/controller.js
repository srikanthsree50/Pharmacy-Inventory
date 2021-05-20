const express = require('express');
const uuid = require('uuid4');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ChambersSchema = require('./schema');
const Chambers = mongoose.model('Chambers',ChambersSchema);



const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
   
};

module.exports = function (app) {
    initialize(app);
};