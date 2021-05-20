const bs = require('../generic-schema');
const mongoose = require('mongoose');

// Base Schema
let _baseSchema = new bs(mongoose.Schema);

let MongooseSchemaExtender = function () {

};

MongooseSchemaExtender.prototype.Schema = function (obj, options) {
    return new mongoose.Schema(Object.assign({}, _baseSchema.obj, obj), Object.assign({}, _baseSchema.options, options));
};

module.exports = MongooseSchemaExtender;