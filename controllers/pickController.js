const pickService = require('../services/pickService');

exports.createPick = async (req, res) => {
    try {
        const pick = await pickService.createPick(req.body); 
        res.status(201).send(pick);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getUserPicks = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId;

        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }

        const picks = await pickService.getUserPicksWithOutcome(userId);
        res.status(200).send(picks);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getPicksFromLatestRoundForUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId;

        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }

        const result = await pickService.getPicksFromLatestRound(userId);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "No picks found for the latest round of the specified user." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
// Additional controller methods for managing picks can be added here
