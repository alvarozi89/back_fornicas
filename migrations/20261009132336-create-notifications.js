
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      type: {
        type: Sequelize.ENUM(
          'COMMENT',
          'RATING',
          'REGISTRATION',
          'PAYMENT',
          'SUBSCRIPTION'
        ),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      message: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex(
      'notifications',
      ['profile_id', 'is_read', 'createdAt'],
      {
        name: 'notifications_profile_read_created_idx'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  }
};