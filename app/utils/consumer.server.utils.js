'use strict';

const logger = require('../../config/logger');

const emailsMapSingleton = require('../services/emailsMap.services.server');

exports.onMessage = (message) => {

    const payload = message.value;

    const headers = parseHeaders(payload);

    const messageType = headers['Message-Type'];

    const messageId = headers['Message-Id'];

    const messageTimestamp = headers['Message-Timestamp'];

    switch (messageType) {
        case 'UserUpdated':
            logger.debug('Message Accepted:', messageType, messageTimestamp, messageId);
            addToMap(payload);
            break;
        case 'UserCreated':
            logger.debug('Message Accepted:', messageType, messageTimestamp, messageId);
            addToMap(payload);
            break;
        case 'UserSynchronised': //This is temporary. Waiting to ERights to be deprecated
            logger.debug('Message Accepted:', messageType, messageTimestamp, messageId);
            addToMap(payload);
            break;
        case 'Ping':
            logger.silly('Message Rejected:', messageType, messageTimestamp, messageId);
            break;
        default:
            logger.silly('Message Rejected:', messageType, messageTimestamp, messageId);
            break;
    }

};


exports.onError = (err) => {
    logger.error(err);

    if (err.name === 'FailedToRebalanceConsumerError' || err.name === 'FailedToRegisterConsumerError' || err.name === 'BrokerNotAvailableError') {
        process.exit();
    }
};

exports.parseHeaders = parseHeaders;
exports.parseJSONBody = parseJSONBody;
exports.addToMap = exports;

function parseHeaders (payload) {

    const bits = payload.split('\r\n\r\n');
    const rawHeaders = bits[0].split('\r\n');

    let headers = {};

    for (let header of rawHeaders) {

        let headerBits = header.match(/^([^:]+): (.*)$/);
        if (headerBits && headerBits[1] && headerBits[2]) {
            headers[headerBits[1]] = headerBits[2];
        }
    }

    return headers;

}


function parseJSONBody (payload) {

    const bits = payload.split('\r\n\r\n');

    return JSON.parse(bits[1]);

}

function addToMap(payload) {
    let body = parseJSONBody(payload);
    emailsMapSingleton.set(body.user.id, {
        email: body.user.email,
        firstName: body.user.firstName,
        lastName: body.user.lastName
    });
}

