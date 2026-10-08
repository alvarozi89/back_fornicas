'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('profiles', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            nickname: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            city: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            whatsapp: {
                type: Sequelize.STRING(30),
                allowNull: true
            },

            telegram: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                allowNull: false,
                defaultValue: 'ACTIVE'
            },

            free_until: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('profiles');
    }
};