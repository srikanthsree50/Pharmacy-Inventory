const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
    _id: String,
    TenantId: String,
    TenantName: String,
    HostName: String,
    Copyright: String,
    DisplayName: String,
    OwnerName: String,
    Email: String,
    PhoneNumber: String,
    Language: String,
    AccessTokenTimeOut: 'number',
    RefreshTokenTimeOut: 'number',
    CreatedBy: String,
    CreateDate: Date,
    LastUpdateBy: String,
    LastUpdatedDate: Date
}, {collection: 'Tenant', versionKey: false});


module.exports = TenantSchema;