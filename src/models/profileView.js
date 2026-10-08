'use strict';

module.exports = (sequelize, DataTypes) => {
    const ProfileView = sequelize.define(
        'ProfileView',
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
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },
        {
            tableName: 'profile_views',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );

    ProfileView.associate = (models) => {
        ProfileView.belongsTo(models.Profile, {
            foreignKey: 'profile_id',
            as: 'profile'
        });
    };

    return ProfileView;
};