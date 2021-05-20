const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid4');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const validator = require('./validator');
const core = require('../../modules/core');
const TenantSchema = require('../../tenant');
const UserSchema = require('../../users/core/schema');
const User = mongoose.model('Users', UserSchema);
const Session = require('../../sessions/core/controller');
const UserRoleMapsController = require('../../userrolemaps');
const UserRoleMapsSchema = require('../../userrolemaps/core/schema');
const UserRoleMaps = mongoose.model('UserRoleMaps', UserRoleMapsSchema);
const PersonSchema = require('../../person/core/schema');
const Person = mongoose.model('Person', PersonSchema);
const contextBuilder = require('../../modules/context-builder');


const getDefaultTenant = function (callBack) {
    const Tenant = mongoose.model('Tenant', TenantSchema);
    const DEFAULT_ID = core.DEFAULT_TENANT_ID;
    Tenant.findOne({_id: DEFAULT_ID}, callBack);
};

const GRANT_TYPE_DEFAULT_TOKEN = "token";
const GRANT_TYPE_REFRESH_TOKEN = "refresh_token";

/*
 * Getting user IP Address
 */

const getUserIpAddress = function (req) {
    return (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
};

/*
 * creating anonymous token based on
 * User request by using default tenant
 * and creating a session
 */

const createAnonymousToken = function (req, res, sessionId, refreshTokenId) {

    const tenantResponse = function (error, tenant) {

        const issueTime = new Date().getTime();
        const issueTimeInSeconds = Math.floor(issueTime / 1000);
        const expireTimeInSeconds = Math.floor(issueTimeInSeconds + 60 * tenant.AccessTokenTimeOut);
        const userIpAddress = getUserIpAddress(req);
        let refreshToken;

        console.log(refreshTokenId)

        if (refreshTokenId === null || refreshTokenId === undefined) {
            refreshToken = String(uuid());
            refreshToken = refreshToken.replace(/-/g, "");
            Session.createSession(sessionId, tenant._id, tenant.AccessTokenTimeOut, userIpAddress, refreshToken);
        } else {
            refreshToken = refreshTokenId;
            Session.sessionUpdate(refreshToken, tenant.AccessTokenTimeOut);
        }

        const payload = {
            "origin": tenant.HostName,
            "session_id": sessionId,
            "user_id": tenant._id,
            "display_name": tenant.Copyright,
            "user_name": tenant.OwnerName,
            "email": tenant.Email,
            "phone_number": tenant.PhoneNumber,
            "language": tenant.Language,
            "logged_in": false,
            "role": "anonymous",
            "nbf": issueTimeInSeconds,
            "exp": expireTimeInSeconds,
            "iss": tenant.Copyright,
            "aud": "*"
        };

        jwt.sign(payload, core.SECRET_KEY, function (error, token) {
            if (!error) {
                const tokenContext = contextBuilder.anonymousTokenContext(payload.exp, payload.nbf, token,
                    userIpAddress, tenant.AccessTokenTimeOut, refreshToken);
                res.json(tokenContext);
            } else {
                const err = contextBuilder.defaultErrorContext('Token creation failed');
                res.json(err)
            }
        });


    };

    /*
     * tenantResponse is a callback function
     */

    getDefaultTenant(tenantResponse);
};

/*
 *updating session by refreshToken
 */

const createLoginTokenByRefreshToken = function (req, res, sessionId, UserId, refreshTokenId) {

    const tenantResponse = function (err, tenant) {

        const userSelectFields = 'DisplayName UserName PhoneNumber';

        User.findOne({_id: UserId}, userSelectFields, function (err, user) {
            if (!err) {
                const issueTime = new Date().getTime();
                const issueTimeInSeconds = Math.floor(issueTime / 1000);
                const expireTimeInSeconds = Math.floor(issueTimeInSeconds + 60 * tenant.AccessTokenTimeOut);
                const UserName = user.UserName;

                const userIpAddress = getUserIpAddress(req);
                let refreshToken;
                refreshToken = refreshTokenId;
                Session.sessionUpdate(refreshToken, expireTimeInSeconds);
                let mRoles = null;
                UserRoleMapsController().GetUserRoles(user._id, function (roleError, roles) {

                    if (roleError || roles === null || roles === undefined) {
                        mRoles = "anonymous";
                    } else {
                        const mUserRoles = [];
                        roles.forEach((role) => {
                            mUserRoles.push(role.RoleName);
                        });
                        mRoles = mUserRoles;
                    }

                    const payload = {
                        "origin": tenant.HostName,
                        "session_id": sessionId,
                        "user_id": UserId,
                        "display_name": user.DisplayName,
                        "user_name": UserName,
                        "email": user.PhoneNumber,
                        "language": user.Language,
                        "logged_in": true,
                        "role": mRoles,
                        "nbf": issueTimeInSeconds,
                        "exp": expireTimeInSeconds,
                        "iss": UserName,
                        "aud": "*"
                    };

                    user.Password = undefined;
                    const UserCopy = JSON.parse(JSON.stringify(user));
                    UserCopy._id = undefined;
                    UserCopy['UserId'] = user._id;
                    jwt.sign(payload, core.SECRET_KEY, function (error, token) {
                        if (!error) {
                            const tokenContext = contextBuilder.anonymousTokenContext(payload.exp, payload.nbf, token,
                                userIpAddress, tenant.AccessTokenTimeOut, refreshToken);
                            res.json(tokenContext);
                        } else {
                            const err = contextBuilder.defaultErrorContext('Token creation failed');
                            res.json(err)
                        }
                    });
                })
            }
        })

    };

    getDefaultTenant(tenantResponse);

};

/*
 * Creating new token based on refresh token
 * and sending it to authorize for the next calls to
 * this system
 */

const refreshTokenIssuer = function (req, res, refresh_token) {

    if (refresh_token) {
        // refresh token will be generated here

        Session.getSessionByRefreshToken(refresh_token, function (err, session) {

            if (!err) {
                if (session.UserId === core.DEFAULT_TENANT_ID) {
                    createAnonymousToken(req, res, session._id, refresh_token);
                } else {
                    console.log("token")
                    createLoginTokenByRefreshToken(req, res, session._id, session.UserId, refresh_token);
                }

            } else {
                let error = contextBuilder.defaultErrorContext('invalid refresh token');
                res.status(401).send(error);
            }

        });
    }
    else {
        let error = contextBuilder.defaultErrorContext('refresh token missing');
        res.status(401).send(error);
    }

};


/*
*verify token
*/

const isValidToken = function (token, callback) {
    jwt.verify(token, core.SECRET_KEY, callback);
};

const tokenPayload = function (token, callback) {
    if (token) {
        const tokens = token.split(" ");
        if (tokens.length === 2) {

            jwt.verify(tokens[1], core.SECRET_KEY, function (error, decode) {

                if (!error) {
                    callback(decode);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    }
    else {
        callback(null);
    }
};

const getIdentity = function (router) {
    router.get('/GetIdentity', function (req, res) {
        let tokenData;
        const token = req.headers.authorization;
        tokenPayload(token, function (data) {
            tokenData = data;
        });

        let payload = {};

        if (tokenData.user_id === core.DEFAULT_TENANT_ID) {
            payload.LoggedIn = false;

            payload = {
                PhoneNumberVerified: true,
                DisplayName: "PharmaRetail",
                FirstName: "",
                LastName: "",
                UserName: "PharmaRetail",
                PhoneNumber: "",
                PublicUserId: "",
                UserId: tokenData.UserId,
                LoggedIn: false,
                Roles: [
                    "anonymous"
                ]
            };

            res.json(payload);

        } else {

            const userSelectFields = '_id DisplayName FirstName LastName UserName PhoneNumber PhoneNumberVerified Password PublicUserId';

            User.findOne({_id: tokenData.user_id}, userSelectFields, function (err, user) {
                if (!err) {
                    let mRoles = null;
                    UserRoleMapsController().GetUserRoles(user._id, function (roleError, roles) {

                        if (roleError || roles === null || roles === undefined) {
                            mRoles = "anonymous";
                        } else {
                            const mUserRoles = [];
                            roles.forEach((role) => {
                                mUserRoles.push(role.RoleName);
                            });
                            mRoles = mUserRoles;
                        }
                        user.Password = undefined;
                        const UserCopy = JSON.parse(JSON.stringify(user));
                        UserCopy._id = undefined;
                        UserCopy['UserId'] = user._id;
                        UserCopy.LoggedIn = true;
                        UserCopy.Roles = mRoles;
                        res.json(UserCopy);
                    })
                } else {
                    res.json({}).status(400);
                }


            });

        }
    })
};

const getToken = function (router) {

    router.post('/token', function (req, res) {
        const grant_type = req.body.grant_type;
        const refresh_token = req.body.refresh_token;

        console.log(refresh_token)

        if (grant_type === GRANT_TYPE_DEFAULT_TOKEN) {
            const sessionId = String(uuid());
            createAnonymousToken(req, res, sessionId);
        }
        else if (grant_type === GRANT_TYPE_REFRESH_TOKEN) {
            if (refresh_token) {
                console.log("refresh")
                refreshTokenIssuer(req, res, refresh_token);
            } else {
                const error = contextBuilder.defaultErrorContext('invalid refresh token');
                res.status(400).send(error)
            }
        }
        else {
            const error = contextBuilder.defaultErrorContext('invalid Grant');
            res.status(400).send(error);
        }
    })
};

const createLoginToken = function (req, res, sessionId) {

    const userPhoneNumber = req.body.PhoneNumber;
    const password = req.body.Password;

    const tenantResponse = function (err, tenant) {

        const userSelectFields = '_id DisplayName FirstName LastName UserName PhoneNumber PhoneNumberVerified Password PublicUserId';

        User.findOne({PhoneNumber: userPhoneNumber}, userSelectFields, function (err, user) {

            if (err) {
                res.status(400).send(err);
                return;
            }

            if (!user) {
                const passwordOrPhoneNumberUnMatched = contextBuilder.passwordOrPhoneNumberUnMatchedContext("nothing found");
                res.status(400).json(passwordOrPhoneNumberUnMatched);
                return
            }

            let passwordIsValid = false;
            try {
                passwordIsValid = bcrypt.compareSync(password, user.Password);
            }
            catch (err) {
                res.send(err);
                return;
            }
            if (!passwordIsValid) {
                const passwordOrPhoneNumberUnMatched = contextBuilder.passwordOrPhoneNumberUnMatchedContext();
                return res.status(400).json(passwordOrPhoneNumberUnMatched);
            }

            /*if (!user.PhoneNumberVerified) {
                const err = contextBuilder.defaultErrorContext('User account not active');
                res.status(400).send(err);
                return;
            }*/

            const issueTime = new Date().getTime();
            const issueTimeInSeconds = Math.floor(issueTime / 1000);
            const expireTimeInSeconds = Math.floor(issueTimeInSeconds + 200 * tenant.AccessTokenTimeOut);
            const UserName = user.UserName;

            const userIpAddress = getUserIpAddress(req);
            let refreshToken = String(uuid());
            refreshToken = refreshToken.replace(/-/g, "");
            Session.createSession(sessionId, user._id, tenant.AccessTokenTimeOut, userIpAddress, refreshToken);

            let mRoles = null;

            UserRoleMapsController().GetUserRoles(user._id, function (roleError, roles) {

                if (roleError || roles === null || roles === undefined) {
                    mRoles = "anonymous";
                } else {
                    const mUserRoles = [];
                    roles.forEach((role) => {
                        mUserRoles.push(role.RoleName);
                    });
                    mRoles = mUserRoles;
                }

                const payload = {
                    "origin": tenant.HostName,
                    "session_id": sessionId,
                    "user_id": user._id,
                    "display_name": user.DisplayName,
                    "user_name": UserName,
                    "email": user.PhoneNumber,
                    "language": user.Language,
                    "logged_in": true,
                    "role": mRoles,
                    "nbf": issueTimeInSeconds,
                    "exp": expireTimeInSeconds,
                    "iss": UserName,
                    "aud": "*"
                };

                user.Password = undefined;
                const UserCopy = JSON.parse(JSON.stringify(user));
                UserCopy._id = undefined;
                UserCopy['UserId'] = user._id;
                UserCopy['Roles'] = mRoles;

                jwt.sign(payload, core.SECRET_KEY, function (error, token) {

                    if (!error) {

                        res.json({
                            '.expires': new Date(payload.exp * 1000),
                            '.issued': new Date(payload.nbf * 1000),
                            access_token: token,
                            ip_address: userIpAddress,
                            expires_in: tenant.AccessTokenTimeOut * 60,
                            refresh_token: refreshToken,
                            token_type: 'bearer',
                            user: UserCopy
                        });
                    } else {

                        res.json({
                            success: false,
                            message: "Login Failed"
                        })
                    }
                });


            })
        });
    };
    getDefaultTenant(tenantResponse);
};


const LogIn = function (router) {

    router.post('/Login', function (req, res) {

        const isValid = validator.required(req.body, 'Login');

        if (isValid.Status) {
            const sessionId = String(uuid());
            createLoginToken(req, res, sessionId);
        } else {
            const missingContext = contextBuilder.missingRequiredFieldsContext(isValid.MissingFields);
            res.status(400).send(missingContext);
        }
    })
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
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
        limits: {fileSize: 1024 * 1024 * 20},
        fileFilter: fileFilter
    }
);

const fileUpload = function (router) {

    router.post('/upload', upload.single('profilepic'), function (req, res, next) {// the uploaded file object

        res.json("Image uploaded successfully!");

        //res.json(err);
    });
};

/*
const isLoggedIn = function (token, callback) {
    jwt.verify(token, core.SECRET_KEY, callback);
};

/*
*LogOutRequest
*/

const initialize = function (app) {
    const router = express.Router();
    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());
    getToken(router);
    LogIn(router);
    getIdentity(router);
    fileUpload(router);
    app.use('/security', router);
};

module.exports = function (app) {
    initialize(app);
};