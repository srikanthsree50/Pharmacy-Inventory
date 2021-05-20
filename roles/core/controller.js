const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid4');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const RoleSchema = require('./schema');
const Roles = mongoose.model('Roles', RoleSchema);
const SH = require('../../modules/security-handler');
const contextBuilder = require('../../modules/context-builder');
const createRoles = function (router) {
    router.post('/CreateRoles', function (req, res) {

        let id = String(uuid());
        req.header('Content-Type', 'application/json');

        Roles.create(
            {
                _id: id,
                RoleName: "app-user",
                ParentRoles: req.body.ParentRoles,
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
                IdsAllowedToDelete: []

            },
            function (err, roles) {
                if (err) return res.status(200).send(
                    {
                        StatusCode: 1,
                        Error: {
                            Status: true,
                            Code: err.code,
                            Message: [err.message]
                        },
                        Results: []
                    }
                );
                res.status(200).send({
                    StatusCode: 0,
                    Error: {
                        Status: false,
                        Message: ["Roles Creation Successful"]
                    },
                    Results: [
                        {
                            RolesId: Roles._id
                        }
                    ]
                });
            }
        );
    })

};
const getRoles = function (router) {

    router.get('/GetRoles', function (req, res) {
        const SelectedFields = '_id RoleName';
        SH(req, function (security) {

            if (security.isAdmin ) {
                Roles.find({},SelectedFields).then(function (roles) {
                    res.send(roles);

                }).catch(function (err) {
                    res.status(400).send(contextBuilder.defaultErrorContext("No Roles found"));
                });

            } else {
                res.status(400).send(contextBuilder.defaultErrorContext('Access denied'));
            }
        })
    })

};

const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());
    createRoles(router);
    getRoles(router);
    app.use('/roles', router);
};

module.exports = function (app) {
    initialize(app);
};