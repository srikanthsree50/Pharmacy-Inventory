const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const PersonSchema = require('./schema');
const Person = mongoose.model('Persons', PersonSchema);
const core = require('../../modules/core');
const contextBuilder = require('../../modules/context-builder')
const createPerson = function (user, role) {
    let id = String(uuid());
    let fullName = user.FirstName + ' ' + user.LastName;
    let contact = user.PhoneNumber;

    Person.create({
        _id: id,
        UserId: user._id,
        RoleName: role,
        CreatedBy: user._id,
        FullName: fullName,
        PrimaryContact: contact,
        BloodGroup: '--',
        DateOfBirth: "12/31/1994",
        Roles: role,
        Language: "en-US",
        CreatedDate: new Date().toISOString(),
        LastUpdatedBy: user._id,
        LastUpdatedDate: new Date,
        RolesAllowedToRead: ['admin'],
        RolesAllowedToWrite: ['admin'],
        RolesAllowedToUpdate: ['admin'],
        RolesAllowedToDelete: ['admin'],
        IdsAllowedToRead: [user._id],
        IdsAllowedToWrite: [user._id],
        IdsAllowedToUpdate: [user._id],
        IdsAllowedToDelete: [user._id]
    });

    console.log("person");
};


const getPerson = function (router) {

    router.get('/GetPerson', function (req, res) {

        let userId = req.query.UserId;

        if (!userId) {
            res.status(400).send(contextBuilder.defaultErrorContext('User Id not found'));
            return;
        }
        const selectFields = 'UserId FullName PrimaryContact Language DateOfBirth About Address Gender SecondaryContact BloodGroup';

        Person.findOne({UserId: userId}, selectFields)
            .then(function (user) {
                console.log(user);
                res.status(200).send(contextBuilder.defaultSuccessResult([user], ''));
            })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};
const updatePerson = function (router) {
    router.put('/UpdatePerson', function (req, res) {

        let userId = req.body.UserId;
        if (!userId) {
            res.status(400).send(contextBuilder.defaultErrorContext('User Id not found'));
            return;
        }
        Person.findOneAndUpdate({'UserId': userId}, req.body.person)
            .then(function (person) {
                res.status(200).send(contextBuilder.defaultSuccessResult(person, ''));
            })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};
const GetPatientDetails = function (router) {

    router.get('/GetPatientDetails', function (req, res) {

        let patientId = req.query.PatientId;
        console.log(patientId);
        let SelectedFields = 'FullName DateOfBirth Gender';
        Person.find({'UserId': patientId}, SelectedFields).then(function (details) {
            console.log(details);
            res.status(200).send(contextBuilder.defaultSuccessResult(details, ''));

        })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const initialize = function (app) {
    const router = express.Router();
    getPerson(router);
    updatePerson(router);
    GetPatientDetails(router);
    app.use('/security', router);
};

module.exports = function (app) {
    if (app)
        initialize(app);
    return {
        createPerson: createPerson,
    };
};