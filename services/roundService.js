const Round = require('../db/models/Round');
const Pick = require('../db/models/Pick');

exports.createRound = async () => {
    return await Round.create({});
};

exports.ensureOpenRound = async () => {
    const openRound = await Round.findOne({ where: { status: 'open' } });
    if (!openRound) {
        return await Round.create({});
    }
    return openRound; // Return the existing open round if it already exists
};

exports.checkAndCloseRound = async (roundId) => {
    const pickCount = await Pick.count({ where: { round_id: roundId } });
    if (pickCount >= 100) { // Close the round if 100 picks have been made
        await Round.update(
            { 
              status: 'closed',
              end_time: new Date() // Set end_time to the current date/time
            }, 
            { 
              where: { round_id: roundId } 
            }
        );        
        await this.ensureOpenRound(); // Automatically create a new round
        await this.evaluatePicks(roundId); // Evaluate picks for uniqueness
    }
};

exports.evaluatePicks = async (roundId) => {
    const picks = await Pick.findAll({ where: { round_id: roundId } });

    // we want to mark is_unique based on whether it's been picked by anyone else
    const pickCounts = picks.reduce((acc, pick) => {
        acc[pick.number_picked] = (acc[pick.number_picked] || 0) + 1;
        return acc;
    }, {});

    await Promise.all(picks.map(async (pick) => {
        const isUnique = pickCounts[pick.number_picked] === 1;
        pick.is_unique = isUnique;
        await pick.save();
    }));
};

