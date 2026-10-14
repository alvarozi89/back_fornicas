const express = require('express');
const healthRoutes = require('./routes/health.routes');
const profileRoutes = require('./routes/profile.routes');
const authRoutes = require('./routes/auth.routes');
const photoRoutes = require('./routes/photo.routes');
const videoRoutes = require('./routes/video.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const paymentRoutes = require('./routes/payment.routes');
const ratingRoutes = require('./routes/rating.routes');
const commentRoutes = require('./routes/comment.routes');
const reportRoutes = require('./routes/report.routes');
const locationRoutes = require('./routes/location.routes');
const notificationRoutes = require('./routes/notification.routes');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://fornicas-web.pages.dev'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-visitor-token'],
}));
app.use('/api/health', healthRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(
    '/uploads',
    express.static(path.join(__dirname, '../uploads'))
);
module.exports = app;
