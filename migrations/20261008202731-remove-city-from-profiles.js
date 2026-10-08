'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up(queryInterface) {

        await queryInterface.removeColumn(
            'profiles',
            'city'
        );
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.addColumn(
            'profiles',
            'city',
            {
                type: Sequelize.STRING(100),
                allowNull: true
            }
        );
    }

};