const express = require('express');
const router = express.Router();
const packageController = require('../controllers/Admin/PackageController');

router.post('/packages', packageController.createPackage);
router.patch('/packages/:id', packageController.updatePackage);
router.delete('/packages/:id', packageController.deletePackage);
router.get('/packages/user/:id', packageController.getUserPackage);
router.get('/packages/', packageController.getAllPackage);

module.exports = router;
