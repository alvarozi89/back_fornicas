'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {

     static associate(models) {
    User.hasOne(models.Profile, {
        foreignKey: 'user_id',
        as: 'profile'
    });
}
    }

    User.init(
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },

            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true
            },

            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            role: {
                type: DataTypes.ENUM('WOMAN', 'ADMIN'),
                allowNull: false,
                defaultValue: 'WOMAN'
            },

            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
                allowNull: false,
                defaultValue: 'ACTIVE'
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            underscored: true
        }
    );

    return User;
};