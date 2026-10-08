'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Photo extends Model {

        static associate(models) {
            Photo.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });
        }
    }

    Photo.init(
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },

            profile_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },

            url: {
                type: DataTypes.STRING(500),
                allowNull: false
            },

            is_main: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            sort_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Photo',
            tableName: 'photos',
            underscored: true
        }
    );

    return Photo;
};