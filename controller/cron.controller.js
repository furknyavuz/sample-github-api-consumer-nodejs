const RepositoryController = require('./repository.controller');
const CronJob = require('cron').CronJob;
const Axios = require('axios');
const Config = require('../config/env.config');

const NETLIFY_BUILD_HOOK_URI = Config.netlifyEndpoint;

function updateGatsby() {

    if (NETLIFY_BUILD_HOOK_URI) {
        console.log('Gatsby build request will be send');

        Axios.post(NETLIFY_BUILD_HOOK_URI).then(() => {
            console.log('Gatsby build request was successful');
        });
    }
}

function updateDaily() {
    RepositoryController.updateRepositories().then(() => {
        updateGatsby();
    });
}

exports.startCronJobs = function () {
    new CronJob('0 0 * * *', function () {
        updateDaily()
    }, null, true, 'UTC');
};
