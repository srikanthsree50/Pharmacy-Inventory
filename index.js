const db = require('./modules/database');
const express = require('express');
const app = express();

let port = process.env.PORT || 3000;

const UserApp = require('./users');
const RolesApp = require('./roles');
const TenantApp = require('./tenant/index');
const SecurityApp = require('./security');
const Doctor = require('./doctors');
const Person = require('./person');
const UserRoleMap = require('./userrolemaps');
const Prescriptions = require('./prescriptions');
const pharmacyProduct = require('./pharmacyProducts');
const pharmacyInventory = require('./pharmacyInventory');
const ManualInsertion = require("./manualInsertion");
const middleWares = require('./middlewares');
const Medicines = require('./medicines');
const Prescription = require('./prescription');
const StorageService = require('./storageService/index');
/*
 * Initializing User Application
 */

middleWares(app);
ManualInsertion(app);
UserApp(app);
Person(app);
RolesApp(app);
UserRoleMap(app);
SecurityApp(app);
Doctor(app);
Prescription(app);
Medicines(app);
pharmacyInventory(app);
pharmacyProduct(app);
StorageService(app);
//SessionApp(app);
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});

//module.exports = app;