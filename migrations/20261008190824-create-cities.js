'use strict';

module.exports = {
async up(queryInterface, Sequelize) {
await queryInterface.createTable('cities', {
id: {
type: Sequelize.INTEGER,
autoIncrement: true,
primaryKey: true,
allowNull: false
},
department_id: {
type: Sequelize.INTEGER,
allowNull: false,
references: {
model: 'departments',
key: 'id'
},
onUpdate: 'CASCADE',
onDelete: 'RESTRICT'
},
code: {
type: Sequelize.STRING(5),
allowNull: false,
unique: true
},
name: {
type: Sequelize.STRING(100),
allowNull: false
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


await queryInterface.addConstraint('cities', {
  fields: ['department_id', 'name'],
  type: 'unique',
  name: 'unique_city_department_name'
});


},

async down(queryInterface) {
await queryInterface.dropTable('cities');
}
};
