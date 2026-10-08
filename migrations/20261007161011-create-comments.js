'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('comments', {
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

            visitor_token: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            nickname: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM(
                    'PENDING',
                    'APPROVED',
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
        await queryInterface.dropTable('comments');
    }
};