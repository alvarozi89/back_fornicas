'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ForumReport extends Model {
        static associate(models) {
            ForumReport.belongsTo(models.ForumTopic, {
                foreignKey: 'topic_id',
                as: 'topic'
            });
            ForumReport.belongsTo(models.ForumComment, {
                foreignKey: 'comment_id',
                as: 'comment'
            });
        }
    }

    ForumReport.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        topic_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        comment_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        reason: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'REVIEWED', 'DISMISSED'),
            allowNull: false,
            defaultValue: 'PENDING'
        }
    }, {
        sequelize,
        modelName: 'ForumReport',
        tableName: 'forum_reports',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return ForumReport;
};