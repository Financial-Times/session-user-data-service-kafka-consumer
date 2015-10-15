'use strict';

const express = require('express');
const compression = require('compression');

const config = require('./config');

module.exports = () => {

    let app = express();

    app.use(compression());

    require('../app/routes/__health.server.routes')(app);
    require('../app/routes/__gtg.server.routes')(app);

    return app;
};