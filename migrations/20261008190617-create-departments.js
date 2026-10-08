'use strict';

module.exports = {
async up(queryInterface, Sequelize) {
await queryInterface.createTable('departments', {
id: {
type: Sequelize.INTEGER,
autoIncrement: true,
primaryKey: true,
allowNull: false
},
code: {
type: Sequelize.STRING(2),
allowNull: false,
unique: true
},
name: {
type: Sequelize.STRING(100),
allowNull: false,
unique: true
},
created_at: {
allowNull: false,
type: Sequelize.DATE,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
},
updated_at: {
allowNull: false,
type: Sequelize.DATE,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
}
});
},

async down(queryInterface) {
await queryInterface.dropTable('departments');
}
};

