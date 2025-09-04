const express = require('express');
const router = express.Router();
const controller = require('../controllers/User/RequestChangeMentorController');

router.post('/request-change-mentor', controller.createRequest);
router.get('/request-change-mentor', controller.getAllRequests);
router.patch('/request-change-mentor/:id', controller.updateRequestStatus);

module.exports = router;
