'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up(queryInterface, Sequelize) {

        await queryInterface.changeColumn(
            'profiles',
            'city',
            {
                type: Sequelize.STRING(100),
                allowNull: true
            }
        );
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.changeColumn(
            'profiles',
            'city',
            {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        );
    }

};