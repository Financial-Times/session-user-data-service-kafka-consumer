'use strict';

// External modules
require('dotenv').load({silent: true});
const kafka = require('kafka-node');
const uuid = require('node-uuid');
const async = require('async');


/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const consumerUtil = require('./app/utils/consumer.server.utils');
const emailsMapSingleton = require('./app/services/emailsMap.services.server');
const logger = require('./config/logger');
const sentry = require('./config/sentry').init();
const express = require('./config/express');
const processUsers = require('./app/utils/processUsers.server.utils');
const shutdown = require('./app/utils/shutdown.server.utils');

const loggerId = 'SERVER:' + config.processId;

const HighLevelConsumer = kafka.HighLevelConsumer;

const clientId = uuid.v4();

const client = new kafka.Client(config.zookeeperHosts, clientId);

const offset = new kafka.Offset(client);

const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024*1024,
    groupId: config.consumerGroupId
};

const topics = [{ topic: config.consumerTopic }];

const consumer = new HighLevelConsumer(client, topics, options);

/* istanbul ignore next */
process.on('SIGTERM', () => {
    shutdown(loggerId);
});

consumer.on('registered', () => logger.info('Kafka consumer registered'));

consumer.on('message', consumerUtil.onMessage);

consumer.on('error', consumerUtil.onError);

logger.info('Kafka consumer started. CHANNEL=' + config.consumerTopic + ' GROUP=' + config.consumerGroupId);

//Process the events Map
async.forever(processUsers.process, logger.error);

let app = express();

app.listen(config.port);

module.exports = app;

logger.info(loggerId, process.env.NODE_ENV + ' server running at http://localhost:' + config.port);