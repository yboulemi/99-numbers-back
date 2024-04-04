const roundService = require('../services/roundService');

exports.createRound = async (req, res) => {
    try {
        const round = await roundService.createRound();
        res.status(201).send(round);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.closeRound = async (req, res) => {
    try {
        const { roundId } = req.params;
        await roundService.closeRound(roundId);
        res.status(200).send({ message: 'Round closed successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
