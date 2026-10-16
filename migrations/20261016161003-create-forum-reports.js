'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('forum_reports', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            topic_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'forum_topics',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            comment_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'forum_comments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            reason: {
                type: Sequelize.STRING(150),
                allowNull: false
            },

            details: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM('PENDING', 'REVIEWED', 'DISMISSED'),
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
        await queryInterface.dropTable('forum_reports');
    }
};