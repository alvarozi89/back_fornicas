const healthService = require('../services/health.service');

const getHealth = (req, res) => {
    const result = healthService.getHealth();

    res.status(200).json(result);
};

module.exports = {
    getHealth
};