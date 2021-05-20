const mongoose = require("mongoose");

const DrugClassesSchema = new mongoose.Schema({
    
    _id: String,
    ClassName: {type: String, unique: true}
},{collection: 'DrugClasses', versionKey: false})

module.exports =  DrugClassesSchema;