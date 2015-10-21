'use strict';

// External modules

const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

const loggerId = 'SERVER:' + config.processId;

exports.updateOrCreateUser = (user) => {

    return new Promise((fulfill, reject) => {

        let stringBody = JSON.stringify({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });

        fetch(config.userListsEndpoint + '/' + user.uuid, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(stringBody)
            },
            body: stringBody
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            //We received a status we do not accept
            logger.error('Unexpected response from SUDS API', response);
            throw new Error(response.statusText);
        })
        .then(fulfill)
        .catch(reject);
    });
};
