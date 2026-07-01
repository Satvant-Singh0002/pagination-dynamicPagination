const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiControllers");
const authMiddleware = require('../middleware/authMiddleware');
router.post("/category", aiController.getCategory);
router.get("/report",authMiddleware, aiController.generateReport);
module.exports = router;