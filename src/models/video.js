'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Video extends Model {

        static associate(models) {
            Video.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });
        }
    }

    Video.init(
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

            thumbnail_url: {
                type: DataTypes.STRING(500),
                allowNull: true
            },

            sort_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Video',
            tableName: 'videos',
            underscored: true
        }
    );

    return Video;
};