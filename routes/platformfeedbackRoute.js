const express = require("express");
const router = express.Router();
const controller = require("../controllers/Admin/PlatformfeedbackController");

router.post("/", controller.submitFeedback);
router.get("/", controller.getAllFeedbacks);

module.exports = router;
