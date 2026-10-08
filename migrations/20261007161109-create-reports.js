'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reports', {
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

            comment_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            visitor_token: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            reason: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM(
                    'PENDING',
                    'REVIEWED',
                    'RESOLVED',
                    'REJECTED'
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
        await queryInterface.dropTable('reports');
    }
};