const { v4: uuidv4 } = require('uuid');

const generateVisitorToken = () => {
    return uuidv4();
};

module.exports = {
    generateVisitorToken
};