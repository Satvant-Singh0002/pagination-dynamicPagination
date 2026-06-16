const express = require('express');
const router = express.Router();
const loginControllers=require('../controllers/loginControllers');

router.post('/Userlogin',loginControllers.login);
module.exports=router;