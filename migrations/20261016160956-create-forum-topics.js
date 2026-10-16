'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('forum_topics', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            nickname: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            title: {
                type: Sequelize.STRING(255),
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
        await queryInterface.dropTable('forum_topics');
    }
};