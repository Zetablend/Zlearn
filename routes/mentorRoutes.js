const express = require('express');
const router = express.Router();
const {mentorRegisterValidation,
  mentorDocumentValidation } = require('../middlewares/validateMiddleware');
const validate = require('../middlewares/validation');
const mentorController = require('../controllers/Mentor/mentorController');


router.post('/registration', mentorController.createMentor);
//router.post('/uploaddocuments', mentorDocumentValidation,validate,mentorController.uploadFiles);
router.get('/myprofile:id', mentorController.getMentors);
router.delete('/delete:id', mentorController.deleteMentor);
router.patch('/updatementor', mentorController.updateMentors);

module.exports = router;
