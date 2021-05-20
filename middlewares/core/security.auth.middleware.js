const jwt = require('jsonwebtoken');
const core = require('../../modules/core');

const EXEMPT_URLS = ['token'];

const initMiddleWare = function (app) {

    app.use('/', function (req, res, next) {

        let flag = true;

        EXEMPT_URLS.forEach((url)=>{
            if (req.url.indexOf(url) > -1) {
                flag = false;
            }
        });

        if (!flag){
            next();
            return;
        }

        const token = req.headers.authorization;
        if (token) {

            //console.log(token)
            const tokens = token.split(" ");
            //console.log(tokens[1])

            if (tokens.length === 2) {

                jwt.verify(tokens[1], core.SECRET_KEY, function (error, decode) {

                    if (!error) {
                        next();
                    } else {
                        res.status(401).send({
                            StatusCode: 1,
                            Error: {
                                Status: true,
                                Message: ["invalid token 1"]
                            }
                        });
                    }
                });
            } else {
                res.status(401).send({
                    StatusCode: 1,
                    Error: {
                        Status: true,
                        Message: ["Invalid Token 2"]
                    }
                });
            }
        } else {
            res.status(403).send({
                StatusCode: 1,
                Error: {
                    Status: true,
                    Message: ["Forbiden"]
                }
            });
        }
    })
};

module.exports = initMiddleWare;