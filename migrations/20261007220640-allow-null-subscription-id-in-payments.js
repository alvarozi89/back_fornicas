'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn(
            'payments',
            'subscription_id',
            {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'subscriptions',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn(
            'payments',
            'subscription_id',
            {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'subscriptions',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        );
    }
};