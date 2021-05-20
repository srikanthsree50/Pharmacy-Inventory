const jwt = require('jsonwebtoken');
const core = require('../../core');

const isAdmin = function (roles) {
    return roles.indexOf('admin') > -1;
};

const isDoctor = function (roles) {
    return roles.indexOf('doctor') > -1;
};

const isPatient = function (roles) {
    return roles.indexOf('patient') > -1;
};

const isPharmacy = function (roles) {
    return roles.indexOf('pharmacy') > -1;
};

const checkRoles = function (security, roles) {
    if (isAdmin(roles)) {
        security.isAdmin = true;
    } else if (isDoctor(roles)) {
        security.isDoctor = true;
    } else if (isPatient(roles)) {
        security.isPatient = true;
    } else if (isPharmacy(roles)) {
        security.isPharmacy = true;
    } else {
        security.isAnonymous = true;
    }
    return security;
};
const securityHandler = function (req, callback) {
    let security = {
        isAdmin: false,
        isDoctor: false,
        isPatient: false,
        isPharmacy: false,
        isAnonymous: false,
        isValid: true
    };

    const token = req.headers.authorization;
    if (token) {

        //console.log(token)
        const tokens = token.split(" ");
        //console.log(tokens[1])

        if (tokens.length === 2) {

            jwt.verify(tokens[1], core.SECRET_KEY, function (error, decode) {
                if (!error) {
                    security = checkRoles(security, decode.role);
                    callback(security)
                } else {
                    security.isValid = false;
                    callback(security);
                }
            });
        } else {
            security.isValid = false;
            callback(security);
        }
    } else {
        security.isValid = false;
        callback(security);
    }
};

module.exports = securityHandler;