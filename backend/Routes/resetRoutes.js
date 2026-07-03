const express = require('express');
const router = express.Router();
const resetPasswordController=require('../controllers/resetPasswordController');
router.get('/resetPassword/:id',resetPasswordController.resetPassword);
module.exports=router;