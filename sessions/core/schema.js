const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({

    _id: String,
    RefreshTokenId: String,
    ClientId: String,
    UserId: String,
    IpAddress: String,
    IssuedUtc: Date,
    ExpireUtc: Date,
    Active: 'boolean'
}, {collection: 'Sessions', versionKey: false});


module.exports = SessionSchema;