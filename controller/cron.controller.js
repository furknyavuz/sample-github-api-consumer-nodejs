const RepositoryController = require('./repository.controller');
const CronJob = require('cron').CronJob;

function updateDaily() {
    RepositoryController.updateRepositories();
}

exports.startCronJobs = function () {
    new CronJob('0 0 * * *', function () {
        updateDaily()
    }, null, true, 'UTC');
};
