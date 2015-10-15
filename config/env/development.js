'use strict';

const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;
const zookeeperHosts = process.env.ZOOKEEPER_HOSTS;
const consumerGroupId = process.env.CONSUMER_GROUP_ID || 'dev-session-user-data-service';
const consumerTopic = 'membership_users_v1';
const port = process.env.PORT || 1339;

const userListsEndpoint = process.env.USER_LISTS_ENDPOINT;

module.exports = {
    port: port,
    processId: processId,
    logLevel: logLevel,
    zookeeperHosts: zookeeperHosts,
    consumerTopic: consumerTopic,
    consumerGroupId: consumerGroupId,
    userListsEndpoint: userListsEndpoint
};
