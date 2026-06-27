const express = require('express');
const router = express.Router();
const paymentController=require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const verifypaymentController=require('../controllers/verifyControllers');
router.get('/BuyPremium',authMiddleware,paymentController.buyPremium);
router.post('/verifyPayment', authMiddleware, verifypaymentController.verifyPayment);
router.get("/verify-payment", authMiddleware, paymentController.verifyPayment);
 
module.exports=router;