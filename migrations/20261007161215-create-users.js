'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true
            },

            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            role: {
                type: Sequelize.ENUM('WOMAN', 'ADMIN'),
                allowNull: false,
                defaultValue: 'WOMAN'
            },

            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
                allowNull: false,
                defaultValue: 'ACTIVE'
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
        await queryInterface.dropTable('users');
    }
};