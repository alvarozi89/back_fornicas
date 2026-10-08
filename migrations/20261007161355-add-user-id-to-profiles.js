'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('profiles', 'user_id', {
            type: Sequelize.BIGINT,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('profiles', 'user_id');
    }
};