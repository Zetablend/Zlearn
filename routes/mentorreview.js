const express = require('express');
const router = express.Router();
const mentorReviewController = require('../controllers/Mentor/mentorReviewControllers');

router.post('/sessionreview', mentorReviewController.submitReview);
router.get('/testimonial/:mentorId', mentorReviewController.getMentorTestimonials);
router.post('/testimonial', mentorReviewController.createOrUpdateTestimonial);

module.exports = router;