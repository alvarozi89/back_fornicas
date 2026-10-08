'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Rating extends Model {

        static associate(models) {
            Rating.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });
        }
    }

    Rating.init(
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

            visitor_token: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            rating: {
                type: DataTypes.TINYINT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Rating',
            tableName: 'ratings',
            underscored: true
        }
    );

    return Rating;
};