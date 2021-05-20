const express = require('express');
const uuid = require('uuid4');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PrimarySchema = require('./primary-prescription');
const Primary = mongoose.model('primaryPrescriptions', PrimarySchema);
const ComplaintsSchema = require('./complaints');
const Complaints = mongoose.model('Complaints', ComplaintsSchema);
const MedicineSchema = require('./medicines');
const Medicines = mongoose.model('prescribedMedicines', MedicineSchema);
const ExamSchema = require('./exam');
const Exams = mongoose.model('exams', ExamSchema);
const AllExamsSchema = require('./allexams');
const AllExams = mongoose.model('AllExams', AllExamsSchema);
const AdviceSchema = require('./advice');
const Advice = mongoose.model('advices', AdviceSchema);

const nextSchema = require('./prescribe');
const NextAppointments = mongoose.model('nextAppointment', nextSchema);
const contextBuilder = require('../../modules/context-builder');

const primaryPrescription = function (router) {

    router.post('/primary', function (req, res) {
        id = String(uuid());
        Primary.create({
            _id: id,
            DoctorId: req.body.DoctorId,
            DoctorName: req.body.DoctorName,
            PatientId: req.body.PatientId,
            PatientName: req.body.PatientName,
            PatientAge: req.body.PatientAge,
            IssuedDate: new Date(),
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};

const getPrimaryPrescription = function (router) {
    router.get('/GetPrimaryPrescription', function (req, res) {

        let prescriptionId = req.query.PrescriptionId;
        let selectedFields = 'PatientId DoctorId';

        //console.log(prescriptionId);
        Primary.findOne({'_id': prescriptionId}, selectedFields)
            .then(function (information) {
                //console.log(information);
                res.status(200).send(contextBuilder.defaultSuccessResult(information, ''));

            })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const getPrescriptionAndDoctorId = function (router) {

    router.get('/getPrescriptionsAndDoctorIds', function (req, res) {

        let PatientId = req.query.UserId;
        let selectedFields = 'DoctorId DoctorName IssuedDate';
        Primary.count({'PatientId': PatientId}, function (err, count) {
            Primary.find({'PatientId': PatientId}, selectedFields)
                .then(function (information) {
                    //console.log(information);

                    res.status(200).send(contextBuilder.defaultSuccessResult(information, count));

                })
                .catch(function (err) {

                    const error = contextBuilder.defaultErrorContext(err.message);
                    return res.json(error)
                });
        })
    })
};

const getPrescriptionsAndDoctorIds = function (router) {

    router.get('/getPrescriptions', function (req, res) {


        let selectedFields = 'DoctorId DoctorName IssuedDate';
        Primary.count({}, function (err, count) {
            Primary.find({}, selectedFields)
                .then(function (information) {
                    //console.log(information);

                    res.status(200).send(contextBuilder.defaultSuccessResult(information, count));

                })
                .catch(function (err) {

                    const error = contextBuilder.defaultErrorContext(err.message);
                    return res.json(error)
                });
        })
    })
};

const getDoctorId = function (router) {

    router.get('/getDoctorId', function (req, res) {

        let PresCriptionId = req.query.PrescriptionId;
        let selectedFields = 'DoctorId';

        Primary.findOne({'PrescriptionId': PresCriptionId}, selectedFields)
            .then(function (information) {
                //console.log(information);
                console.log(information);
                res.status(200).send(contextBuilder.defaultSuccessResult(information, ''));

            })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};
const complaints = function (router) {

    router.post('/complaints', function (req, res) {
        //console.log(req.body);
        id = String(uuid());
        Complaints.create({
            _id: id,
            DoctorId: req.body.DoctorId,
            PatientId: req.body.PatientId,
            PrescriptionId: req.body.PrescriptionId,
            Complaints: req.body.Complaints,
            IssuedDate: new Date(),
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};

const medicines = function (router) {

    router.post('/medicines', function (req, res) {

        id = String(uuid());
        Medicines.create({
            _id: id,
            DoctorId: req.body.DoctorId,
            PatientId: req.body.PatientId,
            PrescriptionId: req.body.PrescriptionId,
            BrandName: req.body.BrandName,
            IsPrescribed: req.body.IsPrescribed,
            Comments: req.body.Comments,
            UpToDays: req.body.UpToDays,
            IssuedDate: new Date(),
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};

const exams = function (router) {

    router.post('/exams', function (req, res) {

        id = String(uuid());
        Exams.create({
            _id: id,
            DoctorId: req.body.DoctorId,
            PatientId: req.body.PatientId,
            PrescriptionId: req.body.PrescriptionId,
            ExamName: req.body.ExamName,
            IssuedDate: new Date(),
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};

const storeExams = function (router) {

    router.post('/allexams', function (req, res) {

        id = String(uuid());
        AllExams.create({
            _id: id,
            ExamName: req.body.ExamName,
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};

const getExams = function (router) {

    router.post('/GetExams', function (req, res) {

        let char = req.query.Char;
        //console.log(char);
        let selectedFields = 'ExamName';
        AllExams.find({'ExamName': {$regex: char}}).select(selectedFields)
            .then(function (medicines) {
                AllExams.countDocuments({'BrandName': {$regex: char}}, (error, count) => {
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

const NextAppointment = function (router) {

    router.post('/nextAppointment', function (req, res) {

        id = String(uuid());
        NextAppointments.create({
            _id: id,
            DoctorId: req.body.DoctorId,
            PatientId: req.body.PatientId,
            PrescriptionId: req.body.PrescriptionId,
            NextAppointmentDate: req.body.NextAppointmentDate,
            DiseaseHistory: req.body.DiseaseHistory,
            IssuedDate: new Date(),
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};

const AddAdvice = function (router) {

    router.post('/addAdvice', function (req, res) {
       // console.log(req.body);
        id = String(uuid());
        Advice.create({
            _id: id,
            DoctorId: req.body.DoctorId,
            PatientId: req.body.PatientId,
            PrescriptionId: req.body.PrescriptionId,
            Advice: req.body.Advice,
            IssuedDate: new Date(),
            Language: req.body.Language ? req.body.Language : "en-US",
            CreatedBy: id,
            CreatedDate: new Date,
            LastUpdatedBy: id,
            LastUpdatedDate: new Date,
            RolesAllowedToRead: ['admin'],
            RolesAllowedToWrite: ['admin'],
            RolesAllowedToUpdate: ['admin'],
            RolesAllowedToDelete: ['admin'],
            IdsAllowedToRead: [id],
            IdsAllowedToWrite: [id],
            IdsAllowedToUpdate: [id],
            IdsAllowedToDelete: []
        }, function (err, prescriptionId) {

            if (!err) {
                res.json(contextBuilder.defaultSuccessResult(id, ''));
            } else {
                res.json(err);
            }
        })
    })
};


const GetComplaints = function (router) {

    router.get('/GetComplaints', function (req, res) {

        let prescriptionId = req.query.prescriptionId;
        let selectedFields = 'Complaints';
        Complaints.find({'PrescriptionId': prescriptionId}, selectedFields)
            .then(function (Complaints) {
                //console.log(Complaints);
                res.status(200).send(contextBuilder.defaultSuccessResult(Complaints, ''));

            })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const GetexamsForThisPrescription = function (router) {

    router.get('/examsForPrescription', function (req, res) {

        let prescriptionId = req.query.prescriptionId;
        let selectedFields = 'ExamName';
        Exams.find({'PrescriptionId': prescriptionId}, selectedFields)
            .then(function (Exams) {
                //console.log(Exams);
                res.status(200).send(contextBuilder.defaultSuccessResult(Exams, ''));

            })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const GetAdvice = function (router) {

    router.get('/GetAdvices', function (req, res) {

        let prescriptionId = req.query.prescriptionId;
        let selectedFields = 'Advice';
        Advice.find({'PrescriptionId': prescriptionId}, selectedFields)
            .then(function (advices) {
                //console.log(advices);
                res.status(200).send(contextBuilder.defaultSuccessResult(advices, ''));

            })
            .catch(function (err) {

                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const GetPrescribedMedicine = function (router) {

    router.get('/GetPrescribedMedicine', function (req, res) {

        let prescriptionId = req.query.prescriptionId;
        let SelectedFields = 'BrandName Comments UpToDays IsPrescribed IssuedDate';

        Medicines.find({'PrescriptionId': prescriptionId}, SelectedFields).then(function (medicines) {
           // console.log(medicines);
            res.status(200).send(contextBuilder.defaultSuccessResult(medicines, ''));

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
    app.use('/prescript', router);
    primaryPrescription(router);
    getPrimaryPrescription(router);
    getPrescriptionAndDoctorId(router);
    getDoctorId(router);
    complaints(router);
    medicines(router);
    storeExams(router);
    getExams(router);
    exams(router);
    NextAppointment(router);
    GetComplaints(router);
    GetPrescribedMedicine(router);
    AddAdvice(router);
    GetexamsForThisPrescription(router);
    GetAdvice(router);
    getPrescriptionsAndDoctorIds(router);

};

module.exports = function (app) {
    initialize(app);
};