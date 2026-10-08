'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subscription extends Model {

        static associate(models) {
            Subscription.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });

            Subscription.hasMany(models.Payment, {
                foreignKey: 'subscription_id',
                as: 'payments'
            });
        }
    }

    Subscription.init(
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

            type: {
                type: DataTypes.ENUM('FREE_TRIAL', 'PAID'),
                allowNull: false
            },

           status: {
    type: DataTypes.ENUM(
        'PENDING',
        'ACTIVE',
        'EXPIRED',
        'CANCELLED'
    ),
    allowNull: false,
    defaultValue: 'PENDING'
},

            start_date: {
                type: DataTypes.DATE,
                allowNull: false
            },

            end_date: {
                type: DataTypes.DATE,
                allowNull: false
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Subscription',
            tableName: 'subscriptions',
            underscored: true
        }
    );

    return Subscription;
};