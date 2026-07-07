const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const downloadControllers = require('../controllers/downloadExpenseControllers');
router.get('/downloadExpense',authMiddleware,downloadControllers.downloadExpenses);
module.exports=router;