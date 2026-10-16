'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('forum_comments', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            topic_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'forum_topics',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            parent_comment_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'forum_comments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            nickname: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM('PUBLISHED', 'HIDDEN', 'DELETED'),
                allowNull: false,
                defaultValue: 'PUBLISHED'
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
        await queryInterface.dropTable('forum_comments');
    }
};