'use strict';

exports.handle = (req, res) => {

    let health = {};
    let now = new Date();

    health.schemaVersion = 1;
    health.name = 'Email Users Kafka Consumer';
    health.description = 'A Kafka Consumer for the User API to keep the User API up-to-date';
    health.checks = [{ // Random check
        name: "The Application is UP",
        ok: true,
        severity: 2,
        businessImpact: 'Some test text',
        technicalSummary: 'Some test text',
        panicGuide: 'Some test text',
        lastUpdated: now.toISOString()
    }];

    res.status(200).json(health);
};