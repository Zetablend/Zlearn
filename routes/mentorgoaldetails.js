const express = require('express');
const router = express.Router();
const mentorgoalsprogressControllers = require('../controllers/Mentor/mentorgoalsprogressControllers')

// POST: upload single or multiple files
router.post('/mentor/goalpost', mentorgoalsprogressControllers.postGoals);

// GET: all resources
router.get('/goalprogress', mentorgoalsprogressControllers.getGoalProgress);

// DELETE: resource by mentor
router.patch('/topicupdate', mentorgoalsprogressControllers.UpdateGoalProgress);



module.exports = router;
