const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const DrugCategoriesSchema = require('./schema');
const DrugCategories = mongoose.model('DrugCategories', DrugCategoriesSchema);