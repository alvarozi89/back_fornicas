'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {

     static associate(models) {
    Profile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Profile.belongsTo(models.City, {
        foreignKey: 'city_id',
        as: 'cityData'
    });

   

    Profile.hasMany(models.Photo, {
        foreignKey: 'profile_id',
        as: 'photos'
    });

   

    Profile.hasMany(models.Video, {
    foreignKey: 'profile_id',
    as: 'videos'
});

Profile.hasMany(models.Subscription, {
    foreignKey: 'profile_id',
    as: 'subscriptions'
});
Profile.hasMany(models.Rating, {
    foreignKey: 'profile_id',
    as: 'ratings'
});

Profile.hasMany(models.ProfileView, {
    foreignKey: 'profile_id',
    as: 'views'
});


Profile.hasMany(models.Comment, {
    foreignKey: 'profile_id',
    as: 'comments'
});

Profile.hasMany(models.Report, {
    foreignKey: 'profile_id',
    as: 'reports'
});
}
    }

    Profile.init(
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },

            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                unique: true
            },

            city_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            title: {
            type: DataTypes.STRING(150),
            allowNull: true
            },

            nickname: {
                type: DataTypes.STRING(100),
                allowNull: true
            },

            birth_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },

           
            whatsapp: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true
            },

            telegram: {
                type: DataTypes.STRING(100),
                allowNull: true
            },

            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
                allowNull: false,
                defaultValue: 'ACTIVE'
            }
        },
       {
        sequelize,
        modelName: 'Profile',
        tableName: 'profiles',
        underscored: true,
        timestamps: true
    }
    );

    return Profile;
};