module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('profiles', 'whatsapp', {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('profiles', 'whatsapp', {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: false
    });
  }
};