'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('profile_views', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
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
                type: Sequelize.STRING(100),
                allowNull: true
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
        await queryInterface.dropTable('profile_views');
    }
};