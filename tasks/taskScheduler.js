const cron = require('node-cron');
const roundService = require('../services/roundService');
const userService = require('../services/userService'); 

const setupScheduledTasks = () => {
    //ensure an open round exists every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled task to ensure an open round exists...');
        await roundService.ensureOpenRound();
    });

    //reset has played today for all users at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Resetting `has_played_today` for all users...');
        await userService.resetHasPlayedToday();
    });
};

module.exports = { setupScheduledTasks };
