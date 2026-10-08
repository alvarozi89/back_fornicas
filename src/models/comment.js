'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {

        static associate(models) {
            Comment.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });

            Comment.hasMany(models.Report, {
                foreignKey: 'comment_id',
                as: 'reports'
            });

            
        }
    }

    Comment.init(
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

            nickname: {
                type: DataTypes.STRING(100),
                allowNull: true
            },

            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            status: {
                type: DataTypes.ENUM(
                    'PENDING',
                    'APPROVED',
                    'REJECTED'
                ),
                allowNull: false,
                defaultValue: 'PENDING'
            }
        },
        {
            sequelize,
            modelName: 'Comment',
            tableName: 'comments',
            underscored: true
        }
    );

    return Comment;
};