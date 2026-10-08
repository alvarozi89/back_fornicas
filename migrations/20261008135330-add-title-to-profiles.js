'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('profiles', 'title', {
            type: Sequelize.STRING(150),
            allowNull: true
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('profiles', 'title');
    }
};