const express = require('express');
const router = express.Router();
const mentorResourceController = require('../controllers/Mentor/mentorResourcesControllers');

// POST: upload single or multiple files
router.post('/mentor/resources', mentorResourceController.postMentorResource);

// GET: all resources
router.get('/mentor/resources', mentorResourceController.getAllResources);

// DELETE: resource by mentor
router.delete('/mentor/resources/:resourceId', mentorResourceController.deleteResource);

router.get('/', mentorResourceController.getAllNotifications);

// Get unread notifications
router.get('/unread', mentorResourceController.getUnreadNotifications);

// Mark as read
router.patch('/:id/read', mentorResourceController.markAsRead);

module.exports = router;
