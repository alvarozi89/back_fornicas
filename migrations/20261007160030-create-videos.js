'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('videos', {
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

            url: {
                type: Sequelize.STRING(500),
                allowNull: false
            },

            thumbnail_url: {
                type: Sequelize.STRING(500),
                allowNull: true
            },

            sort_order: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('videos');
    }
};