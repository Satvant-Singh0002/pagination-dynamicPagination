const express = require('express');
const router = express.Router();
const userControllers= require('../controllers/userControllers');
router.post('/addUser',userControllers.addUser);
module.exports=router;