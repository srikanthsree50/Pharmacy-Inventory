const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const UserROleMapSchema = require('./schema');
const UserRoleMaps = mongoose.model('UserRoleMaps', UserROleMapSchema);
const core = require('../../modules/core');
const contextBuilder = require('../../modules/context-builder');


const GetUserRoles = function (userId, callBack) {
    UserRoleMaps.find({UserId: userId}, 'RoleName', callBack);
};

const createUserRoles = function (userId, roleNames) {
    roleNames.forEach((roleName) => {
        let id = String(uuid());
        UserRoleMaps.create(
            {
                _id: id,
                UserId: userId,
                RoleName: roleName,
                CreatedBy: userId,
                TenantId: core.DEFAULT_TENANT_ID,
                Language: "en-US",
                CreatedDate: new Date,
                LastUpdatedBy: userId,
                LastUpdatedDate: new Date,
                Tags: [],
                RolesAllowedToRead: ['admin'],
                RolesAllowedToWrite: ['admin'],
                RolesAllowedToUpdate: ['admin'],
                RolesAllowedToDelete: ['admin'],
                IdsAllowedToRead: [userId],
                IdsAllowedToWrite: [userId],
                IdsAllowedToUpdate: [userId],
                IdsAllowedToDelete: [userId]

            });
    })
};

const updateUserRole = function (router) {

    router.put('/UpdateUserRole', function (req, res) {
        let userId = req.body.UserId;
        console.log();
        UserRoleMaps.findOneAndUpdate({'UserId': userId}, {'RoleName': req.body.RoleName}).then(function (userRoleMap) {
            res.status(200).send(contextBuilder.defaultSuccessResult([userRoleMap], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};
const getUserRole = function (router) {
    router.get('/GetUserRole', function (req, res) {
        let userId = req.query.UserId;
        let selectedFields = "RoleName";
        UserRoleMaps.findOne({'UserId': userId}, selectedFields).then(function (userRole) {
            res.status(200).send(contextBuilder.defaultSuccessResult([userRole], ''));
        })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};
const initialize = function (app) {
    const router = express.Router();
    updateUserRole(router);
    getUserRole(router);
    app.use('/security', router);
};
module.exports = function (app) {
    if (app) {
        initialize(app);
    }
    return {
        GetUserRoles: GetUserRoles,
        createUserRoles: createUserRoles
    }
};