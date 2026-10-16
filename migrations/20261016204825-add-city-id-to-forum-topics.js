'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_topics', 'city_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // Cámbialo a true si permites temas antiguos sin ciudad obligatoria
      references: {
        model: 'cities', // Asegúrate de que tu tabla en la BD se llame 'cities'
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('forum_topics', 'city_id');
  }
};