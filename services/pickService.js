const Pick = require('../db/models/Pick');
const User = require('../db/models/User');
const roundService = require('./roundService');
const { Op } = require('sequelize');

exports.createPick = async ({ user_id, number_picked }) => {
    // First, check if the user has already played today
    const user = await User.findOne({
        where: { user_id }
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.has_played_today) {
        // If the user has already played today, throw an error or handle as needed
        throw new Error('User has already played today');
    }

    // Ensure there is an open round and get its ID
    const openRound = await roundService.ensureOpenRound();

    const pick = await Pick.create({
        round_id: openRound.round_id, // Use the round_id from the open round
        user_id,
        number_picked
    });

    // Trigger a round check after creating a pick
    await roundService.checkAndCloseRound(openRound.round_id);

    // Set has_played_today to 1 for the user
    await User.update({ has_played_today: 1 }, { where: { user_id: user_id } });

    return { pick_id: pick.pick_id, round_id: pick.round_id, user_id: pick.user_id, number_picked: pick.number_picked };
};


exports.getUserPicksWithOutcome = async (user_id) => {
    // Fetch all finished picks made by the user (excluding where is_unique is null)
    const picks = await Pick.findAll({
        where: {
            user_id,
            is_unique: { [Op.ne]: null } // Exclude picks where 'is_unique' is null
        },
        attributes: ['pick_id', 'round_id', 'user_id', 'number_picked', 'is_unique'], // Only fetch required attributes
    });

    return picks.map(pick => ({
        pick_id: pick.pick_id,
        round_id: pick.round_id,
        user_id: pick.user_id,
        number_picked: pick.number_picked,
        outcome: pick.is_unique
    }));
};

exports.getPicksFromLatestRound = async (user_id) => {
    const latestPick = await Pick.findOne({
        where: { user_id },
        order: [['pick_id', 'DESC']],
        attributes: ['pick_id', 'round_id', 'user_id', 'number_picked', 'is_unique'],
    });

    if (!latestPick) return { userPick: null, allPicks: []}; 

    const allPicks = await Pick.findAll({
        where: { round_id: latestPick.round_id },
        attributes: ['pick_id', 'round_id', 'user_id', 'number_picked', 'is_unique'],
        order: [['number_picked', 'ASC']], 
    });

    // Separate the user's pick from others
    const userPick = allPicks.find(pick => pick.user_id == user_id);

    return {
        userPick, // The latest pick from the user in the latest round they participated
        allPicks, // All picks from the same round
    };
};
