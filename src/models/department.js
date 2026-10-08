'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Department extends Model {


    static associate(models) {
        Department.hasMany(models.City, {
            foreignKey: 'department_id',
            as: 'cities'
        });
    }
}

Department.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(2),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        modelName: 'Department',
        tableName: 'departments',
        underscored: true
    }
);

return Department;


};
