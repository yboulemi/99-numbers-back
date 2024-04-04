const cron = require('node-cron');
const roundService = require('../services/roundService');

const setupScheduledTasks = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled task to ensure an open round exists...');
        await roundService.ensureOpenRound();
    });
};

module.exports = { setupScheduledTasks };
