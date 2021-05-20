const express = require('express');
const uuid = require('uuid4');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MedicineSchema = require('./schema');
const Medicines = mongoose.model('Medicines', MedicineSchema);
const contextBuilder = require('../../modules/context-builder');

const addMedicine = function (router) {
    router.post('/addMedicine', function (req, res) {
        let id = String(uuid());
        console.log(req.body);
        Medicines.create(
            {
                _id: id,
                BrandName: req.body.BrandName,
                GenericName: req.body.GenericName,
                CategoryName: req.body.CategoryName ? req.body.CategoryName : 'Normal',
                DoseForm: req.body.DoseForm,
                Unit: req.body.Unit,
                Language: req.body.Language ? req.body.Language : "en-US",
                CreatedBy: id,
                CreatedDate: new Date,
                LastUpdatedBy: id,
                LastUpdatedDate: new Date,
                Tags: [],
                RolesAllowedToRead: ['admin'],
                RolesAllowedToWrite: ['admin'],
                RolesAllowedToUpdate: ['admin'],
                RolesAllowedToDelete: ['admin'],
                IdsAllowedToRead: [id],
                IdsAllowedToWrite: [id],
                IdsAllowedToUpdate: [id],
                IdsAllowedToDelete: ['admin']

            }, function (err, medicine) {
                if (err) {
                    const error = contextBuilder.defaultErrorContext(err.message);
                    return res.json(error)
                }
                else {
                    res.json(medicine);
                }

            })
    })
};
const GetMedicine = function (router) {

    router.post('/GetMedicines', function (req, res) {

        let char = req.query.Char;
        let page = req.body.Page;
        let limit = req.body.Limit;
        page = page < 1 ? 0 : page - 1;
        limit = limit > 100 ? 100 : limit;
        let selectedFields = 'BrandName GenericName DoseForm Unit _id';
        Medicines.find({'BrandName': {$regex: char}}).skip(page * limit).limit(limit).select(selectedFields)
            .then(function (medicines) {
                Medicines.countDocuments({'BrandName': {$regex: char}}, (error, count) => {
                    //console.log(users);
                    res.json(contextBuilder.defaultSuccessResult(medicines, count));
                    //res.json(users);
                });

            })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());
    addMedicine(router);
    GetMedicine(router);
    app.use('/medicine', router);
};

module.exports = function (app) {
    initialize(app);

};