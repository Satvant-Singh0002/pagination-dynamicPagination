const express = require('express');
const router = express.Router();
const expenseControllers= require('../controllers/expenseControllers');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/addExpense',authMiddleware,expenseControllers.addExpense);
router.get('/getExpense',authMiddleware,expenseControllers.getExpense);
router.delete('/deleteExpense/:id',authMiddleware,expenseControllers.deletExpense);
module.exports=router;