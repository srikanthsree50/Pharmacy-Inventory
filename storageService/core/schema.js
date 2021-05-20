const ext = require('../../modules/mongoose-extender/index');
const mExtender = new ext();
const mongoose = require('mongoose');
const StorageServiceSchema = new mongoose.Schema({
        UserId: {type: String},
        Url: {type: String,required: true},
        Name: {type: String, required: true},
        Path: {type: String, required: true},
        Type: {type: String, required: false, db_field: 'TypeString'},
    },
    {collection: "UploadFiles", versionKey: false});

module.exports = StorageServiceSchema;

