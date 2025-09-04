const express = require("express");
const router = express.Router();

const controller = require("../controllers/Admin/PlatformhelparticlesController");

router.post("/upload",  controller.uploadHelpArticle);
router.get("/", controller.getAllHelpArticles);

module.exports = router;
