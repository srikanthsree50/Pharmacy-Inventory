const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid4');
const FileUploadSchema = require('./schema');
const FileUploads = mongoose.model('UploadFiles', FileUploadSchema);
const contextBuilder = require('../../modules/context-builder');
const DIR = './uploads';
let URL = 'http://localhost:3000/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});


const uploadFile = function (router) {

    router.post('/UploadFile', upload.single("uploadfile"), (req, res) => {
        console.log(req.file.fieldname);
        let name, path, type;
        let userId = req.body.UserId;
        if (req.file != undefined || req.file != null) {
            path = req.file.path;
            URL = URL + path;
            name = req.file.filename;
            type = req.file.mimetype;

        }
        let id = String(uuid());
        console.log(URL);
        FileUploads.create(
            {
                UserId: userId,
                Path: path,
                Name: name,
                Type: type,
                Url: URL,
            },
            function (err, file) {

                if (err) {

                    const error = contextBuilder.defaultErrorContext(err.message);
                    return res.json(error)
                }
                res.status(200).send({

                    StatusCode: 0,
                    Error: {
                        Status: false,
                        Message: ["file uploaded"]
                    },
                    Results: [
                        {
                            UserId: userId
                        }
                    ]
                });
            });

        //res.json({'msg': 'File uploaded successfully!', 'file': req.file});
    })

};

const uploadFiles = function (router) {

    router.post('/UploadFiles', upload.any(), (req, res) => {
        var i = 0;
        if (req.files.length == 0)
            res.json(console.log('no file uploaded'));
        req.files.forEach(function (file) {
            console.log(file);
        });
        res.send(req.files);
    })
};

const GetResource = function (router) {

};
const GetFiles = function (router) {
    router.get('/GetFiles', upload.any(), (req, res) => {

        let selectedFields = 'URL Type Name';
        let userId = req.query.UserId;
        FileUploads.find({'UserId': userId}, selectedFields).then(function (files) {

            res.status(200).send(contextBuilder.defaultSuccessResult([files], ''));

        })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    });


};


const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    router.use(bodyParser.json({limit: '50mb'}));
    uploadFile(router);
    uploadFiles(router);
    GetResource(router);
    GetFiles(router);
    app.use('/StorageService', router);
    //app.use(fileUpload());
};

module.exports = function (app) {
    initialize(app);

};