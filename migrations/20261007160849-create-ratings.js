'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ratings', {
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

            rating: {
                type: Sequelize.TINYINT,
                allowNull: false
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

        await queryInterface.addConstraint('ratings', {
            fields: ['profile_id', 'visitor_token'],
            type: 'unique',
            name: 'unique_rating_per_visitor'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('ratings');
    }
};