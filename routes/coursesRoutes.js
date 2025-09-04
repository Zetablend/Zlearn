const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/Admin/CoursesController');


router.post('/newcourse', coursesController.postCourses);
//router.post('/uploaddocuments', mentorDocumentValidation,validate,mentorController.uploadFiles);
router.get('/getallcourses', coursesController.getCourses);
router.get('/exportcourses', coursesController.getExportcourses);
router.delete('/deletecourses:id', coursesController.softDeleteCourses);
router.patch('/updatecourses', coursesController.Updatecourses);

module.exports = router;
