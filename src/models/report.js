'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Report extends Model {

        static associate(models) {

            Report.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });

            Report.belongsTo(models.Comment, {
                foreignKey: 'comment_id',
                as: 'comment'
            });
        }
    }

    Report.init(
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

            comment_id: {
                type: DataTypes.BIGINT,
                allowNull: true
            },

            visitor_token: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            reason: {
                type: DataTypes.STRING(150),
                allowNull: false
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            status: {
                type: DataTypes.ENUM(
                    'PENDING',
                    'REVIEWED',
                    'RESOLVED',
                    'REJECTED'
                ),
                allowNull: false,
                defaultValue: 'PENDING'
            }
        },
        {
            sequelize,
            modelName: 'Report',
            tableName: 'reports',
            underscored: true
        }
    );

    return Report;
};