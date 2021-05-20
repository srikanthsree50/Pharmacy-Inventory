const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid4');

const DrugClassesSchema = require('../../drugClasses');
const DrugClasses = mongoose.model('DrugClasses', DrugClassesSchema);

const InsertDataManually = function (router) {

    router.post('/InsertDrugClasses', function (req, res) {

        DrugClassesName = req.body.ClassName
        const id = String(uuid());

        DrugClasses.create({
            
            _id: id,
            ClassName: DrugClassesName
        }, function (err, drugClass) {
            if(err){
                res.json(err);
                return;
            }
            res.json(drugClass)
            return;
        })
    });
}

const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
    InsertDataManually(router);
    app.use('/manually', router);
};

module.exports = function (app) {
    initialize(app);
};
