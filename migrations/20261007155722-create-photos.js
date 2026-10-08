'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('photos', {
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

            is_main: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        await queryInterface.dropTable('photos');
    }
};