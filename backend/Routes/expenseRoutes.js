const express = require('express');
const router = express.Router();
const expenseControllers= require('../controllers/expenseControllers');
router.post('/addExpense',expenseControllers.addExpense);
router.get('/getExpense',expenseControllers.getExpense);
module.exports=router;