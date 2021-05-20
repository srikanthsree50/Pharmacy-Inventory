const mongoose = require('mongoose');
const SessionSchema = require('./schema');
const core = require('../../modules/core');
const Session = mongoose.model('Sessions', SessionSchema);

const createSession = function (sessionId, userId, accessTokenTimeout, userIpAddress, refresh_token) {
    const issueTime = new Date().getTime();
    const issueTimeInSeconds = Math.floor(issueTime);
    const expireTimeInSeconds = Math.floor(issueTimeInSeconds + 60 * accessTokenTimeout);

    const session = new Session({
        _id: sessionId,
        RefreshTokenId: refresh_token,
        ClientId: core.DEFAULT_TENANT_ID,
        UserId: userId,
        IpAddress: userIpAddress,
        IssuedUtc: issueTimeInSeconds,
        ExpireUtc: expireTimeInSeconds,
        Active: true
    });
    session.save();
};

const sessionUpdate = function(refreshTokenId, ExpireTimeInSeconds){
    Session.update({ _id: refreshTokenId}, { $set: { ExpireUtc: ExpireTimeInSeconds }});
}

const getSessionByRefreshToken = function (refreshToken,sessionCallBack) {
    Session.findOne({RefreshTokenId: refreshToken}, sessionCallBack);
};

module.exports = {
    createSession: createSession,
    getSessionByRefreshToken: getSessionByRefreshToken,
    sessionUpdate: sessionUpdate
}


