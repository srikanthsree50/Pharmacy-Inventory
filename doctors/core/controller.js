const express = require('express');
const uuid = require('uuid4');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DoctorSchema = require('./schema');
const Doctors = mongoose.model('Doctors', DoctorSchema);
const UserSchema = require('../../users/core/schema');
const User = mongoose.model('Users', UserSchema);
const contextBuilder = require('../../modules/context-builder');
const UserROleMapSchema = require('../../userrolemaps/core/schema');
const UserRoleMap = mongoose.model('UserRoleMaps', UserROleMapSchema);
const PersonSchema = require('../../person/core/schema');
const Person = mongoose.model('Persons', PersonSchema);
const genericInformationSchema = require('./genericInformation');
const GenericInformations = mongoose.model('GenericInformations', genericInformationSchema);
const socialNetworksSchema = require('./socialNetworks');
const SocialNetworks = mongoose.model('SocialNetworks', socialNetworksSchema);
const professionalExperience = require('./parsonalExperienceSchema');
const ProfessionalExperience = mongoose.model('ProfessionalExperience', professionalExperience);
const doctorFeeSchema = require('./DoctorFee');
const DoctorFees = mongoose.model('DoctorFees', doctorFeeSchema);
const primaryAddresSchema = require('./primaryAddress');
const PrimaryAddress = mongoose.model('PrimaryAddress', primaryAddresSchema);
const SecondaryAddresSchema = require('./secondaryAddress');
const SecondaryAddress = mongoose.model('SecondaryAddress', SecondaryAddresSchema);
const educationalQualificationSchema = require('./educationalQualification');
const EducationalQualifications = mongoose.model('EducationalQualifications', educationalQualificationSchema);
const multer = require('multer');
const awardsSchema = require('./awards');
const Awards = mongoose.model('Awards', awardsSchema);
const chamberSchema = require('./chambers');
const Chambers = mongoose.model('Chambers', chamberSchema);
const availableDaysSchema = require('./abailableDays');
const AvailableDays = mongoose.model('AvailableDays', availableDaysSchema);
const futureGoalsSchema = require('./futureGoals');
const FutureGoals = mongoose.model('FutureGoals', futureGoalsSchema);
const workSampleSchema = require('./workSamples');
const WorkSamples = mongoose.model('WorkSamples', workSampleSchema);
const organizations = require('./organizations');
const Organizations = mongoose.model('Organizations', organizations);
const visaInformationSchema = require('./visInformation');
const VisaInformation = mongoose.model('VisaInformations', visaInformationSchema);


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimeType];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(null, "uploads/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimeType];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

const getDoctors = function (router) {
        router.post('/GetDoctors', function (req, res) {

            let page = req.body.Page;
            let limit = req.body.Limit;
            let filter = req.body.Filter;
            page = page < 1 ? 0 : page - 1;
            limit = limit > 100 ? 100 : limit;

            if (filter != undefined) {
                let tempFilter = {'RoleName': filter.Role};
                console.log(filter.Role);
                let Users = [];
                UserRoleMap.find(tempFilter).skip(page * limit).limit(limit).select('UserId').exec(function (err, userIds) {
                    if (!err) {
                        let filteredUsersIds = [];
                        userIds.forEach(function (item) {
                            filteredUsersIds.push(item.UserId)
                        });
                        //console.log(filteredUsersIds);
                        let typeFilter;
                        if (filter.PhoneNumberVerified === false || !filter.PhoneNumberVerified) {
                            typeFilter = {}
                        }
                        else
                            typeFilter = {'PhoneNumberVerified': filter.PhoneNumberVerified};
                        let selectedFieldsForUserTable = "FirstName LastName PhoneNumber ProfilePicture";
                        let selectedFieldsForPersonTable = "UserId FullName DateOfBirth BloodGroup Address";

                        User.find({}).select(selectedFieldsForUserTable)
                            .where('_id').in(filteredUsersIds).exec(function (err, users) {
                            if (!err) {
                                UserRoleMap.count({'RoleName': filter.Role}, function (err, count) {
                                        Person.find({}).select(selectedFieldsForPersonTable).where('UserId').in(filteredUsersIds).exec(function (err, persons) {
                                            if (!err) {
                                                if (filter.Role === 'doctor') {
                                                    let doctorInformation = [];
                                                    let doctorfeeselect = 'UserId FirstTimeFee RevisitFee Specialities';
                                                    DoctorFees.find({}).select(doctorfeeselect).where('UserId').in(filteredUsersIds).exec(function (err, feeAndSpecialities) {
                                                        doctorInformation = {
                                                            'Users': users,
                                                            'Persons': persons,
                                                            'FeeAndSpecialities': feeAndSpecialities
                                                        };

                                                        if (!err) {
                                                            res.json(contextBuilder.defaultSuccessResult(doctorInformation, count));
                                                        }
                                                        else {
                                                            res.json(contextBuilder.defaultErrorContext("Error finding Doctor information!"))
                                                        }
                                                    });

                                                } else {

                                                    let doctorInformation = {
                                                        'Users': users,
                                                        'Persons': persons
                                                    };
                                                    if (!err) {
                                                        res.json(contextBuilder.defaultSuccessResult(doctorInformation, count));
                                                    } else {
                                                        res.json(contextBuilder.defaultErrorContext("Error finding Doctor information!"))
                                                    }

                                                }
                                            } else {
                                                res.json(contextBuilder.defaultErrorContext("Error finding Doctor information!"))
                                            }

                                        });
                                        //res.json(users);
                                    }
                                );
                            } else {
                                res.json(err);
                            }
                        })
                        //console.log(filteredUsersIds)
                    } else {
                        res.json(err);
                        console.log(err)
                    }
                })
            }
        })
        ;

    }
;

const UpdateDoctorGenericInformation = function (router) {

    router.put('/UpdateDoctorGenericInformation', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        GenericInformations.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                // console.log(req.body);
                GenericInformations.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (genericinformation) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(genericinformation, 'updated'));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {

                let ID = String(uuid());
                GenericInformations.create({
                    _id: ID,
                    UserId: userId,
                    ProfileImage: req.body.ProfilePicture,
                    FirstName: req.body.FirstName,
                    MiddleName: req.body.MiddleName,
                    LastName: req.body.LastName,
                    Gender: req.body.Gender,
                    Nationality: req.body.Nationality,
                    DateOfBirth: req.body.DateOfBirth,
                    Country: req.body.Country,
                    City: req.body.City,
                    PrimaryMobile: req.body.PrimaryMobile,
                    SecondaryMobile: req.body.SecondaryMobile ? req.body.SecondaryMobile : "",
                    PrimaryEmail: req.body.PrimaryEmail,
                    SecondaryEmail: req.body.SecondaryEmail ? req.body.SecondaryEmail : "",
                    PersonalWebsite: req.body.PersonalWebsite ? req.body.PersonalWebsite : "",
                    Resume: req.body.Resume ? req.body.Resume : "",
                    AboutMe: req.body.AboutMe ? req.body.AboutMe : "",
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'generic information updated'));
                    else res.json(err);
                });
            }

        })
    });
};
const GetDoctorGenericInformation = function (router) {

    router.get('/GetDoctorGenericInformation', function (req, res) {

        let userId = req.query.UserId;

        let selectedFields = 'UserId FirstName MiddleName LastName Gender Nationality DateOfBirth' +
            ' Country City PrimaryMobile SecondaryMobile PrimaryEmail PersonalWebsite Resume AboutMe';
        GenericInformations.findOne({'UserId': userId}, selectedFields).then(function (genericInformation) {
            //console.log(genericInformation);
            res.status(200).send(contextBuilder.defaultSuccessResult([genericInformation], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateDoctorSocialLinks = function (router) {

    router.post('/UpdateDoctorSocialNetworks', function (req, res) {

        let userId = req.body.UserId;
        console.log(userId);
        let isAllready;
        console.log(req.body);
        SocialNetworks.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {

                SocialNetworks.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (person) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(person, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {

                let id = String(uuid());
                console.log(req.body);
                SocialNetworks.create({
                    _id: id,
                    UserId: req.body.UserId,
                    Facebook: req.body.Facebook ? req.body.Facebook : "",
                    Twitter: req.body.Twitter ? req.body.Twitter : "",
                    LinkedIn: req.body.LinkedIn ? req.body.LinkedIn : "",
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, networks) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(networks, 'networks updated'));
                    else res.json(err);
                })
            }

        })
    });
};
const GetDoctorNetworkInformation = function (router) {

    router.get('/GetDoctorNetworkInformation', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId Facebook Twitter LinkedIn';
        SocialNetworks.findOne({'UserId': userId}, selectedFields).then(function (networkInformation) {

            res.status(200).send(contextBuilder.defaultSuccessResult([networkInformation], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateDoctorProfessionalExperience = function (router) {

    router.post('/UpdateDoctorProfessionalExperience', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        ProfessionalExperience.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                ProfessionalExperience.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (socialNetworks) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(socialNetworks, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                ProfessionalExperience.create({
                    _id: id,
                    UserId: userId,
                    MedicalName: req.body.MedicalName,
                    JobTitle: req.body.JobTitle,
                    Location: req.body.Location,
                    Skills: req.body.Skills,
                    From: req.body.From,
                    Upto: req.body.Upto,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'professional experience updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetDoctorProfessionalExperience = function (router) {

    router.get('/GetDoctorProfessionalExperience', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId MedicalName JobTitle Location From Skills UpTo';
        ProfessionalExperience.findOne({'UserId': userId}, selectedFields).then(function (professionalExperience) {

            res.status(200).send(contextBuilder.defaultSuccessResult([professionalExperience], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateDoctorFee = function (router) {

    router.post('/UpdateDoctorFee', function (req, res) {

        let userId = req.body.UserId;

        let isAllready;
        DoctorFees.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {

                DoctorFees.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (socialNetworks) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(socialNetworks, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                DoctorFees.create({
                    _id: id,
                    UserId: userId,
                    Specialities: req.body.Specialities,
                    Currency: req.body.Currency,
                    FirstTimeFee: req.body.FirstTimeFee,
                    RevisitFee: req.body.RevisitFee,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'Doctor fee updated!'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetDoctorFee = function (router) {

    router.get('/GetDoctorFee', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId  Specialities Currency FirstTimeFee RevisitFee';
        DoctorFees.findOne({'UserId': userId}, selectedFields).then(function (professionalExperience) {

            res.status(200).send(contextBuilder.defaultSuccessResult([professionalExperience], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdatePrimaryAddress = function (router) {

    router.post('/UpdatePrimaryAddress', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        PrimaryAddress.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                if (req.body.SetAsPrimary == 'true') {
                    req.body.SetAsPrimary = true;
                } else {
                    req.body.SetAsPrimary = false;
                }
                PrimaryAddress.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (PrimaryAddress) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(PrimaryAddress, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {

                let id = String(uuid());

                if (req.body.SetAsPrimary == 'true') {
                    req.body.SetAsPrimary = true;
                } else {
                    req.body.SetAsPrimary = false;
                }
                console.log(req.body);
                PrimaryAddress.create({
                    _id: id,
                    UserId: userId,
                    ApartmentOrSuiteOrOther: req.body.ApartmentOrSuiteOrOther,
                    Street: req.body.Street,
                    City: req.body.City,
                    Country: req.body.Country,
                    ZipCode: req.body.ZipCode,
                    State: req.body.State,
                    SetAsPrimary: req.body.SetAsPrimary,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'address updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetPrimaryAddress = function (router) {

    router.get('/GetPrimaryAddress', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId ApartmentOrSuiteOrOther Street City Country State ZipCode SetAsPrimary';
        PrimaryAddress.findOne({'UserId': userId}, selectedFields).then(function (primaryAddress) {

            res.status(200).send(contextBuilder.defaultSuccessResult([primaryAddress], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateAwards = function (router) {

    router.post('/UpdateAwards', function (req, res) {

        let Name = req.body.Name;
        let isAllready;
        Awards.countDocuments({'Name': Name}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                console.log(req.body);
                Awards.findOneAndUpdate({'Name': Name}, req.body)
                    .then(function (awards) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(awards, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {

                let id = String(uuid());
                Awards.create({
                    _id: id,
                    UserId: req.body.UserId,
                    Name: req.body.Name,
                    Company: req.body.Company,
                    Description: req.body.Description,
                    Year: req.body.Year,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'Awards updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetAwards = function (router) {

    router.get('/GetAwards', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId Name Company Company Description Year';
        Awards.find({'UserId': userId}, selectedFields).then(function (awards) {

            res.status(200).send(contextBuilder.defaultSuccessResult(awards, ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateSecondaryAddress = function (router) {

    router.post('/UpdateSecondaryAddress', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        SecondaryAddress.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                SecondaryAddress.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (secondaryAddress) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(secondaryAddress, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {

                let id = String(uuid());
                SecondaryAddress.create({
                    _id: id,
                    UserId: userId,
                    ApartmentOrSuiteOrOther: req.body.ApartmentOrSuiteOrOther,
                    Street: req.body.Street,
                    City: req.body.City,
                    Country: req.body.Country,
                    ZipCode: req.body.ZipCode,
                    Language: "en-US",
                    State: req.body.State,
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]

                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'secondary address updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetSecondaryAddress = function (router) {

    router.get('/GetSecondaryAddress', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId ApartmentOrSuiteOrOther Street City State Country ZipCode';
        SecondaryAddress.findOne({'UserId': userId}, selectedFields).then(function (professionalExperience) {

            res.status(200).send(contextBuilder.defaultSuccessResult([professionalExperience], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateEducationalQualification = function (router) {

    router.post('/UpdateEducationalQualification', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        EducationalQualifications.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                EducationalQualifications.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (secondaryAddress) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(secondaryAddress, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {

                let id = String(uuid());
                EducationalQualifications.create({
                    _id: id,
                    UserId: userId,
                    BachelorOrEquivalentDegree: req.body.BachelorOrEquivalentDegree,
                    MasterDegreeOrEquivalentDegree: req.body.MasterDegreeOrEquivalentDegree,
                    PHDOrEquivalentDegree: req.body.PHDOrEquivalentDegree,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'educational experience updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetEducationalQualification = function (router) {

    router.get('/GetEducationalQualification', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId BachelorOrEquivalentDegree MasterDegreeOrEquivalentDegree PHDOrEquivalentDegree';
        EducationalQualifications.findOne({'UserId': userId}, selectedFields).then(function (educationalQualification) {

            res.status(200).send(contextBuilder.defaultSuccessResult([educationalQualification], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateFutureGoals = function (router) {

    router.post('/UpdateFutureGoals', function (req, res) {

        let CourseName = req.body.CourseName;
        let isAllready;
        FutureGoals.countDocuments({'CourseName': CourseName}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                console.log(req.body);
                FutureGoals.findOneAndUpdate({'CourseName': CourseName}, req.body)
                    .then(function (goals) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(goals, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                let userId = req.body.UserId;
                FutureGoals.create({
                    _id: id,
                    UserId: req.body.UserId,
                    CourseName: req.body.CourseName,
                    From: req.body.From,
                    To: req.body.TO,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'future goals updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetFutureGoals = function (router) {

    router.get('/GetFutureGoals', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId CourseName From To';
        FutureGoals.find({'UserId': userId}, selectedFields).then(function (goals) {

            res.status(200).send(contextBuilder.defaultSuccessResult(goals, ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateOrganizations = function (router) {

    router.post('/UpdateOrganizations', function (req, res) {

        let OrganizationName = req.body.OrganizationName;
        let isAllready;
        Organizations.countDocuments({'OrganizationName': OrganizationName}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                console.log(req.body);
                Organizations.findOneAndUpdate({'OrganizationName': OrganizationName}, req.body)
                    .then(function (organizations) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(organizations, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                let userId = req.body.UserId;
                Organizations.create({
                    _id: id,
                    UserId: req.body.UserId,
                    OrganizationName: req.body.OrganizationName,
                    Designation: req.body.Designation,
                    From: req.body.From,
                    To: req.body.To,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'Organizations updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetOrganizations = function (router) {

    router.get('/GetOrganizations', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId OrganizationName Designation From To';
        Organizations.find({'UserId': userId}, selectedFields).then(function (organizations) {

            res.status(200).send(contextBuilder.defaultSuccessResult(organizations, ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateChamber = function (router) {

    router.post('/UpdateChamber', multer({storage: storage}).single('Document'), function (req, res, next) {

        let userId = req.body.UserId;
        let isAllready;
        const url = req.protocol + '://' + req.get("host");
        Chambers.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                Chambers.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (chamber) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(chamber, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                Chambers.create({
                    _id: id,
                    UserId: userId,
                    ChamberName: req.body.ChamberName,
                    Address: req.body.Address,
                    Website: req.body.Website,
                    PhoneNumber: req.body.PhoneNumber,
                    RegistrationDocumentPath: url + "/uploads/images" + req.file,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]

                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'Chmaber updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetChamber = function (router) {

    router.get('/GetChamber', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = "UserId ChamberName Address Website PhoneNumber RegistrationDocument";
        Chambers.findOne({'UserId': userId}, selectedFields).then(function (chamber) {

            res.status(200).send(contextBuilder.defaultSuccessResult([chamber], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateWorkSamples = function (router) {

    router.post('/UpdateWorkSamples', function (req, res) {

        let VideoLink = req.body.VideoLink;
        let isAllready;
        WorkSamples.countDocuments({'VideoLink': VideoLink}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                console.log(req.body);
                WorkSamples.findOneAndUpdate({'VideoLink': VideoLink}, req.body)
                    .then(function (worksamples) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(worksamples, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                let userId = req.body.UserId;
                let id = String(uuid());
                WorkSamples.create({
                    _id: id,
                    UserId: req.body.UserId,
                    VideoLink: req.body.VideoLink,
                    Description: req.body.Description,
                    Document: req.body.Document,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]
                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'work sample updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetWorkSamples = function (router) {

    router.get('/GetWorkSamples', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId VideoLink Description Document';
        WorkSamples.find({'UserId': userId}, selectedFields).then(function (worksamples) {

            res.status(200).send(contextBuilder.defaultSuccessResult(worksamples, ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateVisaInformation = function (router) {

    router.post('/UpdateVisaInformation', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        VisaInformation.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff
            console.log(req.body);
            console.log(isAllready);
            if (isAllready) {
                if (req.body.WillingToGo == 'true') {
                    req.body.WillingToGo = true;
                } else {
                    req.body.WillingToGo = false;
                }
                VisaInformation.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (chamber) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(chamber, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                if (req.body.WillingToGo == 'true') {
                    req.body.WillingToGo = true;
                } else {
                    req.body.WillingToGo = false;
                }
                VisaInformation.create({
                    _id: id,
                    UserId: userId,
                    WillingToGo: req.body.WillingToGo,
                    Country: req.body.Country,
                    ExpiryDate: req.body.ExpiryDate,
                    VisaType: req.body.VisaType,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]

                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'visa information updated'));
                    else res.json(err);
                });
            }

        })
    })
};
const GetVisaInformation = function (router) {

    router.get('/GetVisaInformation', function (req, res) {

        let userId = req.query.UserId;
        let selectedFields = 'UserId WillingToGo Country ExpiryDate VisaType';
        VisaInformation.findOne({'UserId': userId}, selectedFields).then(function (chamber) {

            res.status(200).send(contextBuilder.defaultSuccessResult([chamber], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const UpdateAvailableDays = function (router) {

    router.post('/UpdateAvailableDays', function (req, res) {

        let userId = req.body.UserId;
        let isAllready;
        AvailableDays.countDocuments({}, function (err, count) {
            if (err) {
                return handleError(err)
            } //handle possible errors
            isAllready = count;
            //and do some other fancy stuff

            console.log(isAllready);
            if (isAllready) {
                AvailableDays.findOneAndUpdate({'UserId': userId}, req.body)
                    .then(function (chamber) {
                        res.status(200).send(contextBuilder.defaultSuccessResult(chamber, ''));
                    })
                    .catch(function (err) {
                        const error = contextBuilder.defaultErrorContext(err.message);
                        return res.json(error)
                    });
            } else {
                console.log(req.body);
                let id = String(uuid());
                AvailableDays.create({
                    _id: id,
                    UserId: userId,
                    Saturday: req.body.Saturday,
                    Sunday: req.body.Sunday,
                    Monday: req.body.Monday,
                    Tuesday: req.body.Tuesday,
                    Wednesday: req.body.Wednesday,
                    Thursday: req.body.Thursday,
                    Friday: req.body.Friday,
                    SaturdayFrom: req.body.SaturdayFrom,
                    SaturdayTo: req.body.SaturdayTo,
                    SundayFrom: req.body.SundayFrom,
                    SundayTo: req.body.SundayTo,
                    MondayFrom: req.body.MondayFrom,
                    MondayTo: req.body.MondayTo,
                    TuesdayFrom: req.body.TuesdayFrom,
                    TuesdayTo: req.body.TuesdayTo,
                    WednesdayFrom: req.body.WednesdayFrom,
                    WednesdayTo: req.body.WednesdayTo,
                    ThursdayFrom: req.body.ThursdayFrom,
                    ThursdayTo: req.body.ThursdayTo,
                    FridayFrom: req.body.FridayFrom,
                    FridayTo: req.body.FridayTo,
                    RegistrationDocument: req.body.RegistrationDocument,
                    Language: "en-US",
                    CreatedBy: userId,
                    CreatedDate: new Date().toISOString(),
                    LastUpdatedBy: userId,
                    LastUpdatedDate: new Date().toISOString(),
                    RolesAllowedToRead: ['admin'],
                    RolesAllowedToWrite: ['admin'],
                    RolesAllowedToUpdate: ['admin'],
                    RolesAllowedToDelete: ['admin'],
                    IdsAllowedToRead: [userId],
                    IdsAllowedToWrite: [userId],
                    IdsAllowedToUpdate: [userId],
                    IdsAllowedToDelete: [userId]

                }, function (err, userId) {
                    if (!err)
                        res.json(contextBuilder.defaultSuccessResult(userId, 'Availavle days updated'));
                    else res.json(err);
                });
            }

        })
    })
};

const GetAvailableDays = function (router) {

    router.get('/GetAvailableDays', function (req, res) {

        let userId = req.query.UserId;
        //let selectedFields = "ChamberName Address Website PhoneNumber RegistrationDocument";
        AvailableDays.findOne({'UserId': userId}).then(function (chamber) {

            res.status(200).send(contextBuilder.defaultSuccessResult([chamber], ''));
        })
            .catch(function (err) {
                const error = contextBuilder.defaultErrorContext(err.message);
                return res.json(error)
            });
    })
};

const GetPatients = function (router) {
    router.post('/GetPatients', function (req, res) {
        let page = req.body.Page;
        let limit = req.body.Limit;
        page = page < 1 ? 0 : page - 1;
        limit = limit > 100 ? 100 : limit;
        let Search = req.query.Search;
        let tempFilter = {'RoleName': 'appuser'};

        if (tempFilter != undefined) {
            let Users = [];
            UserRoleMap.find(tempFilter).select('UserId').exec(function (err, userIds) {
                if (!err) {
                    let filteredUsersIds = [];
                    userIds.forEach(function (item) {
                        filteredUsersIds.push(item.UserId)
                    });
                    //console.log(filteredUsersIds);
                    let selectedFieldsForUserTable = "FirstName LastName PhoneNumber ProfilePicture";
                    let selectedFieldsForPersonTable = "FullName DateOfBirth BloodGroup Address";

                    User.find({'FirstName': {$regex: Search}}).select(selectedFieldsForUserTable)
                        .where('_id').in(filteredUsersIds).exec(function (err, users) {
                        if (!err) {

                            Person.find({'FullName': {$regex: Search}}).select(selectedFieldsForPersonTable).where('UserId').in(filteredUsersIds).exec(function (err, persons) {
                                if (!err) {
                                    console.log(users);
                                    let patients = {
                                        'Users': users,
                                        'Persons': persons,
                                    };
                                    let count = users.length;
                                    console.log(count);
                                    res.json(contextBuilder.defaultSuccessResult(patients, count));
                                } else {
                                    res.json(contextBuilder.defaultErrorContext("Error finding Doctor information!"))
                                }

                                //res.json(users);
                            });
                        } else {
                            res.json(err);
                        }
                    })
                    //console.log(filteredUsersIds)
                } else {
                    res.json(err);
                    console.log(err)
                }
            })
        }
    })
};


const initialize = function (app) {
    var router = express.Router();
    router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    router.use(bodyParser.json({limit: '50mb'}));
    getDoctors(router);
    UpdateDoctorGenericInformation(router);
    UpdateDoctorSocialLinks(router);
    UpdateDoctorProfessionalExperience(router);
    UpdateDoctorFee(router);
    UpdatePrimaryAddress(router);
    UpdateSecondaryAddress(router);
    UpdateFutureGoals(router);
    UpdateAwards(router);
    UpdateEducationalQualification(router);
    UpdateOrganizations(router);
    UpdateChamber(router);
    UpdateVisaInformation(router);
    UpdateWorkSamples(router);
    UpdateAvailableDays(router);
    GetDoctorGenericInformation(router);
    GetDoctorNetworkInformation(router);
    GetDoctorProfessionalExperience(router);
    GetDoctorFee(router);
    GetPrimaryAddress(router);
    GetSecondaryAddress(router);
    GetAwards(router);
    GetEducationalQualification(router);
    GetFutureGoals(router);
    GetOrganizations(router);
    GetChamber(router);
    GetVisaInformation(router);
    GetWorkSamples(router);
    GetAvailableDays(router);
    GetPatients(router);
    app.use('/security', router);
};

module.exports = function (app) {
    initialize(app);

};