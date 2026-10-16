'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ForumTopic extends Model {
        static associate(models) {
            ForumTopic.hasMany(models.ForumComment, {
                foreignKey: 'topic_id',
                as: 'comments'
            });
            ForumTopic.hasMany(models.ForumReport, {
                foreignKey: 'topic_id',
                as: 'reports'
            });
            // 👈 La relación con City va aquí adentro, donde 'models' está disponible
            ForumTopic.belongsTo(models.City, { 
                foreignKey: 'city_id', 
                as: 'city' 
            });
        }
    }

    ForumTopic.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
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
        },
        // 💡 Opcional pero recomendado: define también el campo city_id aquí en los atributos
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ForumTopic',
        tableName: 'forum_topics',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updated_at: 'updated_at'
    });

    return ForumTopic;
};