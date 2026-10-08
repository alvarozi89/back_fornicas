'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {

        static associate(models) {
            Payment.belongsTo(models.Profile, {
                foreignKey: 'profile_id',
                as: 'profile'
            });

            Payment.belongsTo(models.Subscription, {
                foreignKey: 'subscription_id',
                as: 'subscription'
            });
        }
    }

    Payment.init(
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

            subscription_id: {
                type: DataTypes.BIGINT,
                allowNull: true
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },

            payment_date: {
                type: DataTypes.DATE,
                allowNull: false
            },

            payment_method: {
                type: DataTypes.ENUM(
                    'MANUAL',
                    'WOMPI',
                    'MERCADOPAGO',
                    'OTHER'
                ),
                allowNull: false,
                defaultValue: 'MANUAL'
            },

            reference: {
                type: DataTypes.STRING(100),
                allowNull: true
            },

            status: {
                type: DataTypes.ENUM(
                    'PENDING',
                    'APPROVED',
                    'REJECTED',
                    'CANCELLED'
                ),
                allowNull: false,
                defaultValue: 'PENDING'
            }
        },
        {
            sequelize,
            modelName: 'Payment',
            tableName: 'payments',
            underscored: true
        }
    );

    return Payment;
};