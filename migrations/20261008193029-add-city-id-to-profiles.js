'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn(
            'profiles',
            'city_id',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'cities',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            }
        );
    },

    async down(queryInterface) {

        await queryInterface.removeColumn(
            'profiles',
            'city_id'
        );
    }
};