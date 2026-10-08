const express = require('express');
const LocationController = require('../controllers/location.controller');

const router = express.Router();
const locationController = new LocationController();

router.get('/departments', locationController.getDepartments);

router.get(
    '/departments/:departmentId/cities',
    locationController.getCitiesByDepartmentId
);

module.exports = router;