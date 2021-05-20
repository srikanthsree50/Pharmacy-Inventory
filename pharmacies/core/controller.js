const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const PharmaciesSchema = require('./schema');
const Pharmacies = mongoose.model('Pharmacies', PharmaciesSchema);