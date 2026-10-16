'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ForumComment extends Model {
        static associate(models) {
            ForumComment.belongsTo(models.ForumTopic, {
                foreignKey: 'topic_id',
                as: 'topic'
            });
            ForumComment.hasMany(models.ForumReport, {
                foreignKey: 'comment_id',
                as: 'reports'
            });
        }
    }

    ForumComment.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        topic_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        parent_comment_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        nickname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PUBLISHED', 'HIDDEN', 'DELETED'),
            allowNull: false,
            defaultValue: 'PUBLISHED'
        }
    }, {
        sequelize,
        modelName: 'ForumComment',
        tableName: 'forum_comments',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return ForumComment;
};