const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid4');
const validator = require('../../security/core/validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UserSchema = require('./schema');
const jwt = require('jsonwebtoken');
const core = require('../../modules/core');
const User = mongoose.model('Users', UserSchema);
const UserRoleMaps = require('../../userrolemaps');
const Person = require('../../person');
const multer = require('multer');
const contextBuilder = require('../../modules/context-builder');
const UserROleMapSchema = require('../../userrolemaps/core/schema');
const UserRoleMap = mongoose.model('UserRoleMaps', UserROleMapSchema);
const UsernameGenerator = require('username-generator');
const Fakerator = require("fakerator");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({

        storage: storage,
        limits: {fileSize: 1024 * 1024 * 10},
        fileFilter: fileFilter
    }
);

const createNewUser = function (router) {

    router.post('/CreateUser', upload.single('ProfilePicture'), function (req, res) {

        req.header('Content-Type', 'application/json');

        const token = req.headers.authorization;

        const isValid = validator.required(req.body, "CreateUser");
        let role = req.body.Role;
        console.log(req.body);
        if (isValid.Status) {

            let hashedPassword = bcrypt.hashSync(req.body.Password, 8);
            let publicUserId = String(uuid());
            publicUserId = publicUserId.replace(/-/g, "");
            let id = String(uuid());
            let profilePicture = "uploads/propic.jpg";
            if (req.file != undefined || req.file != null) {
                profilePicture = req.file.path;
            }
            User.create(
                {
                    _id: id,
                    DisplayName: req.body.DisplayName ? req.body.DisplayName : "",
                    FirstName: req.body.FirstName,
                    LastName: req.body.LastName,
                    UserName: req.body.FirstName,
                    PhoneNumber: req.body.PhoneNumber,
                    ProfilePicture: profilePicture,
                    Password: hashedPassword,
                    PublicUserId: publicUserId,
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
                function (err, user) {

                    if (err) {

                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    }

                    UserRoleMaps().createUserRoles(id, [role]);
                    Person().createUserPerson(user, [role]);
                    console.log(user);
                    res.status(200).send({

                        StatusCode: 0,
                        Error: {
                            Status: false,
                            Message: ["User Creation Successful"]
                        },
                        Results: [
                            {
                                UserId: user._id
                            }
                        ]
                    });
                }
            );

        } else {

            const missingContext = contextBuilder.missingRequiredFieldsContext(isValid.MissingFields);
            res.status(400).send(missingContext);
        }
    });
};

/*
 * Get User
 */

const getUser = function (router) {

    router.get('/GetUser', function (req, res) {

        req.header('Content-Type', 'application/json');

        let userId = req.query.UserId;
        if (!userId) {
            res.status(400).send(contextBuilder.defaultErrorContext('User Id not found'));
            return;
        }
        const selectedFields = 'FirstName LastName ProfilePicture';
        User.findOne({_id: userId}, selectedFields)
            .then(function (user) {

                res.status(200).send(contextBuilder.defaultSuccessResult([user], ''));

            })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

/*
*user validity check
*/
const isValidUser = function (token, callback) {

    //console.log(core.SECRET_KEY);

    jwt.verify(token, core.SECRET_KEY, callback);
};
/*
*userRoles check
*/
const checkRoles = function (roles) {

    let flag = false;
    var index;
    for (let i = 0; i < roles.length; i++) {

        if (roles[i].toLowerCase() == "admin") {
            flag = true;
        }
    }
    return flag;
}
/*
* Update User
*/
const getUsers = function (router) {

    router.post('/GetUsers', function (req, res) {

        let page = req.body.Page;
        let limit = req.body.Limit;
        let filter = req.body.Filter;
        page = page < 1 ? 0 : page - 1;
        limit = limit > 100 ? 100 : limit;

        if (filter != undefined || filter != null || filter != {}) {
            if (!filter.Role) {
                User.find(filter).skip(page * limit).limit(limit).select('FirstName').select("LastName").select('PhoneNumber').exec(function (err, users) {
                    if (!err) {
                        User.countDocuments(filter, (error, count) => {
                            //console.log(users);
                            res.json(contextBuilder.defaultSuccessResult(users, count));
                            //res.json(users);
                        });
                    } else {
                        res.json(err);
                    }
                })
            }
            else if (filter.Role) {
                let tempFilter = {'RoleName': filter.Role};
                //  console.log(page+ " ",+ limit);
                let Users = [];
                UserRoleMap.find(tempFilter).skip(page * limit).limit(limit).select('UserId').exec(function (err, userIds) {
                    if (!err) {
                        let filteredUsersId = [];
                        userIds.forEach(function (item) {
                            filteredUsersId.push(item.UserId)
                        });
                        //console.log(filteredUsersId);
                        let typeFilter;
                        if (filter.PhoneNumberVerified === false || !filter.PhoneNumberVerified) {
                            typeFilter = {}
                        }
                        else
                            typeFilter = {'PhoneNumberVerified': filter.PhoneNumberVerified};
                        //console.log(typeFilter);
                        User.find(typeFilter).limit(limit).select('FirstName').select("LastName").select('PhoneNumber').where('_id').in(filteredUsersId).exec(function (err, users) {
                            if (!err) {
                                UserRoleMap.countDocuments(tempFilter, (error, count) => {
                                    //console.log(users);
                                    res.json(contextBuilder.defaultSuccessResult(users, count));
                                    //res.json(users);
                                });
                            } else {
                                res.json(err);
                            }
                        })
                        //console.log(filterdUsersId)
                    } else {
                        res.json(err);
                        console.log(err)
                    }
                })
            }
        }
        else {
            User.find(filter).skip(page * limit).limit(limit).select('FirstName').select("LastName").select('PhoneNumber').exec(function (err, users) {
                if (!err) {
                    UserRoleMap.countDocuments(filter, (error, count) => {

                        res.json(contextBuilder.defaultSuccessResult(users, count));
                        //res.json(users);
                    });
                } else {
                    res.json(err);
                }
            })
        }
    })
};

const getUserRoles = function (router) {

    router.post('/GetUserRoles', function (req, Roles) {

        let userId = req.body.ItemId;
        UserRoleMaps().GetUserRoles(userId, function (err, roles) {

            res.json(roles);
        })
    })
};

const UpdateNow = function (req, res) {

    const userId = req.body.UserId;
    console.log("update" + userId + req.body.user.FirstName);

    User.findOneAndUpdate({'_id': userId}, req.body.user)
        .then(function (user) {
            res.status(200).send({
                StatusCode: 0,
                Error: {
                    Status: false,
                    Message: ["User Updated Successfully"]
                },
                Results: [
                    {
                        UserId: user._id
                    }
                ]
            });
        })
        .catch(function (err) {

            const error = contextBuilder.defaultErrorContext(err.message);
            return res.json(error)
        });
};

/*
 * Delete User 
 */

const DeleteNow = function (req, res) {

    const PhoneNumber = req.body.PhoneNumber;
    User.findOneAndRemove({'PhoneNumber': PhoneNumber})
        .then(function (user) {
            res.status(200).send({

                StatusCode: 0,
                Error: {

                    Status: false,
                    Message: ["User Deleted Successfully"]
                },
                Results: [
                    {
                        UserId: user._id
                    }
                ]
            });
        })
        .catch(function (err) {
            const error = contextBuilder.defaultErrorContext("user not found");
            return res.json(error)
        });
};

/*
 * Update request
 */

const updateUser = function (router) {

    router.put('/UpdateUser', function (req, res) {

        req.header('Content -Type', 'application/json');

        isValidUser(req.headers.authorization.split(" ")[1], function (error, decode) {

            if (!error) {

                if (checkRoles(decode.role) && decode.logged_in) {

                    UpdateNow(req, res);
                } else {

                    return res.send("You have no access to this action");
                }
            } else {

                res.json({
                    success: false,
                    message: "Not Authorized"
                })
            }
        })
    })
};

/*
 * Delete request
 */

const deleteUser = function (router) {

    router.delete('/DeleteUser', function (req, res) {

        req.header('Content -Type', 'application/json');

        isValidUser(req.headers.authorization.split(" ")[1], function (error, decode) {

            if (!error) {

                if (checkRoles(decode.role) && decode.logged_in === "true") {

                    DeleteNow(req, res);
                } else {
                    return res.send("You have no access to this action");
                }
            } else {

                res.json({
                    success: false,
                    message: "Not Authorized"
                })
            }
        })
    })
};

const createDummyUsers = function (router) {

    router.post('/CreateDummyUsers', upload.single('ProfilePicture'), function (req, res) {

        req.header('Content-Type', 'application/json');
        const token = req.headers.authorization;
        let fakerator = Fakerator("de-DE");
        let phoneNumber = fakerator.phone.number();
        let hashedPassword = bcrypt.hashSync(phoneNumber, 8);
        let publicUserId = String(uuid());
        let FirstName = fakerator.names.firstName();
        let LastName = fakerator.names.firstNameM();
        let DisplayName = FirstName + " " + LastName;


        publicUserId = publicUserId.replace(/-/g, "");
        let id = String(uuid());
        let profilePicture = "uploads/propic.jpg";
        if (req.file != undefined || req.file != null) {
            profilePicture = req.file.path;
        }
        User.create(
            {
                _id: id,
                DisplayName: DisplayName,
                FirstName: FirstName,
                LastName: LastName,
                UserName: FirstName,
                PhoneNumber: phoneNumber,
                ProfilePicture: profilePicture,
                Password: hashedPassword,
                PublicUserId: publicUserId,
                Language: "en-US",
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
            function (err, user) {

                if (err) {

                    const error = contextBuilder.defaultErrorContext(err.message);
                    return res.json(error)
                }

                UserRoleMaps().createUserRoles(id, ['appuser']);
                Person().createUserPerson(user, ['appuser']);
                res.status(200).send({

                    StatusCode: 0,
                    Error: {
                        Status: false,
                        Message: ["doctor Creation Successful"]
                    },
                    Results: [
                        {
                            UserId: user._id
                        }
                    ]
                });
            }
        );

    });
};


/*
 * Initialize Controller
 */

const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    router.use(bodyParser.json({limit: '50mb'}));
    createNewUser(router);
    getUser(router);
    getUsers(router);
    getUserRoles(router);
    updateUser(router);
    deleteUser(router);
    createDummyUsers(router);
    app.use('/security', router);
};

module.exports = function (app) {
    initialize(app);
};
