const express = require('express');
const router = express.Router();

const updatePasswordController=require('../controllers/updatePasswordControllers');
router.post('/updatepassword/:id',updatePasswordController.updatePassword);
module.exports=router;