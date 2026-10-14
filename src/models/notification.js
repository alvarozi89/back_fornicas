
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(
                'COMMENT',
                'RATING',
                'REGISTRATION',
                'PAYMENT',
                'SUBSCRIPTION'
            ),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        message: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'notifications'
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.Profile, {
            foreignKey: 'profile_id',
            as: 'profile'
        });
    };

    return Notification;
};