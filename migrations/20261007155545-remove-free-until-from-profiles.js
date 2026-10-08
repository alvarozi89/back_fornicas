'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.removeColumn('profiles', 'free_until');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('profiles', 'free_until', {
            type: Sequelize.DATE,
            allowNull: true
        });
    }
};