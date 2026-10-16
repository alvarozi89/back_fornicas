'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

const User = require('./user')(sequelize, DataTypes);
const Profile = require('./profile')(sequelize, DataTypes);
const ProfileView = require('./profileView')(sequelize, DataTypes);
const Photo = require('./photo')(sequelize, DataTypes);
const Video = require('./video')(sequelize, DataTypes);
const Subscription = require('./subscription')(sequelize, DataTypes);
const Payment = require('./payment')(sequelize, DataTypes);
const Rating = require('./rating')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes);
const Report = require('./report')(sequelize, DataTypes);
const Department = require('./department')(sequelize, DataTypes);
const City = require('./city')(sequelize, DataTypes);
const Notification = require('./notification')(sequelize, DataTypes);
const PasswordReset = require('./passwordreset')(sequelize, DataTypes);
const ForumComment = require('./forumcomment')(sequelize, DataTypes);
const ForumReport = require('./forumreport')(sequelize, DataTypes);
const ForumTopic = require('./forumtopic')(sequelize, DataTypes);

db.User = User;
db.Profile = Profile;
db.ProfileView = ProfileView;
db.Photo = Photo;
db.Video = Video;
db.Subscription = Subscription;
db.Payment = Payment;
db.Rating = Rating;
db.Comment = Comment;
db.Report = Report;
db.Department = Department;
db.City = City;
db.Notification = Notification;
db.PasswordReset = PasswordReset;
db.ForumComment = ForumComment;
db.ForumReport = ForumReport;
db.ForumTopic = ForumTopic;

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;