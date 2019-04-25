const config = require('./config/env.config.js');
const express = require('express');
const bodyParser = require('body-parser');

const Router = require('./config/routes.config');
const CronController = require('./controller/cron.controller');

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());
Router.routesConfig(app);
CronController.startCronJobs();

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
