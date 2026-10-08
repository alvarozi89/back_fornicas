'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
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

            subscription_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'subscriptions',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            payment_date: {
                type: Sequelize.DATE,
                allowNull: false
            },

            payment_method: {
                type: Sequelize.ENUM(
                    'MANUAL',
                    'WOMPI',
                    'MERCADOPAGO',
                    'OTHER'
                ),
                allowNull: false,
                defaultValue: 'MANUAL'
            },

            reference: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM(
                    'PENDING',
                    'APPROVED',
                    'REJECTED',
                    'CANCELLED'
                ),
                allowNull: false,
                defaultValue: 'PENDING'
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
        await queryInterface.dropTable('payments');
    }
};