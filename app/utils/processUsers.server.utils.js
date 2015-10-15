'use strict';

const async = require('async');

const config = require('../../config/config');
const emailsMapSingleton = require('../services/emailsMap.services.server');
const usersListsClient = require('../services/usersListsClient.server.services');
const logger = require('../../config/logger');

const loggerId = 'SERVER:' + config.processId;

exports.process = (next) => {

    let usersArray = [];

    emailsMapSingleton.forEach((userObject, uuid) => {
        usersArray.push({
            uuid: uuid,
            email: userObject.email,
            firstName: userObject.firstName,
            lastName: userObject.lastName
        });
    });

    async.eachLimit(usersArray, 10, updateOrCreateUser, next);

};


function updateOrCreateUser(user, callback) {

    logger.info(loggerId, 'Attempting to edit user', {user: user.uuid});
    let userBeingSent = JSON.parse(JSON.stringify(user));

    // We attempt to edit the user
    usersListsClient.editUser(user)
        .then(() => {
            logger.debug(loggerId, 'User updated', {user: user.uuid});
            deleteFromMapIfUnchanged(userBeingSent);
            callback();
        })
        .catch(updateError => {

            if (updateError.message === 'Not Found') {

                // If the User does not exist yet, we attempt to create it
                logger.info(loggerId, 'Attempting to create user', {user: user.uuid});
                return usersListsClient.addUser(user)
                    .then(() => {
                        logger.debug(loggerId, 'User created', {user: user.uuid});
                        deleteFromMapIfUnchanged(userBeingSent);
                        callback();
                    })
                    .catch(addError => {
                        //We received an error from the user API.
                        //We log the error and we will try again later
                        logger.error(loggerId, addError);
                        callback();
                    });
            }
            else {
                //We received an error from the user API different from 404.
                //We log the error and we will try again later
                logger.error(loggerId, updateError);
                callback();
            }
        });

}

function deleteFromMapIfUnchanged (storedUser) {
    let uuid = storedUser.uuid;
    let userInMap = emailsMapSingleton.get(uuid);
    if (storedUser.email === userInMap.email && storedUser.firstName === userInMap.firstName && storedUser.lastName === userInMap.lastName) {
        emailsMapSingleton.delete(uuid);
        logger.debug('User deleted from map', {user: uuid});
    }
    else {
        logger.info('User kept in map', {user: uuid});
    }
}

exports.deleteFromMapIfUnchanged = deleteFromMapIfUnchanged;
exports.updateOrCreateUser = updateOrCreateUser;