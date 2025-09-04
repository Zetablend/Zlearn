const express = require('express');
const router = express.Router();
const { sessionvalidation} = require('../middlewares/validateMiddleware');
const validate = require('../middlewares/validation');
const sessionControllers = require('../controllers/Admin/sessionController')
const coursesControllers = require('../controllers/Admin/CoursesController')

// POST: upload single or multiple files
router.post('/admin/newsession', sessionvalidation,validate,sessionControllers.createEvent);

// GET: all resources
router.get('/user/sessiondetails', sessionControllers.getNextSession);

router.get('/user/upcomingsessiondetails', sessionControllers.getUpcomingSessions);
router.get('/user/pastsessiondetails', sessionControllers.getPastSessions);
router.patch('/admin/updatesession', sessionControllers.UpdateSession);
router.patch('/mentor/uploaddocuments', sessionControllers.uploaddocument);
router.get('/user/alldocuments', sessionControllers.getdocuments);
router.get('/admin/:id', coursesControllers.getcoursedetails);
router.get('/admin/getcourse', coursesControllers.getCourses);
router.get('/admin/getexportcourse', coursesControllers.getExportcourses);
router.post('/admin/newcourse', coursesControllers.postCourses);
router.patch('/admin/updatecourse', coursesControllers.Updatecourses);
router.delete('/admin/deletecourse', coursesControllers.softDeleteCourses);




module.exports = router;