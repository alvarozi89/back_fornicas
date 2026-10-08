'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class City extends Model {


    static associate(models) {
        City.belongsTo(models.Department, {
            foreignKey: 'department_id',
            as: 'department'
        });
    }
}

City.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(5),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'City',
        tableName: 'cities',
        underscored: true
    }
);

return City;


};
