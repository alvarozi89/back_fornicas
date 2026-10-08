'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('subscriptions', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            profile_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'profiles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            type: {
                type: Sequelize.ENUM('FREE_TRIAL', 'PAID'),
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM('ACTIVE', 'EXPIRED', 'CANCELLED'),
                allowNull: false
            },

            start_date: {
                type: Sequelize.DATE,
                allowNull: false
            },

            end_date: {
                type: Sequelize.DATE,
                allowNull: false
            },

            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('subscriptions');
    }
};