
// const Order = require("../models/orderModels");
// const User = require("../models/userModels");
// const jwt = require("jsonwebtoken");
// const { Cashfree, CFEnvironment } = require("cashfree-pg");

// const cashfree = new Cashfree(
//   CFEnvironment.SANDBOX,
//   process.env.CASHFREE_APP_ID,
//   process.env.CASHFREE_SECRET_KEY
// );

// const verifyPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ message: "orderId is required" });
//     }
    

  
//     const paymentResponse = await cashfree.PGOrderFetchPayments(orderId);
//     const payments = paymentResponse.data;
//     console.log("Payments data:", JSON.stringify(payments));

//     if (!payments || payments.length === 0) {
//       await Order.update({ status: "FAILED" }, { where: { orderId } });
//       return res.status(200).json({ success: false, message: "TRANSACTION FAILED" });
//     }

//     const latestPayment = payments[payments.length - 1];
//     const paymentStatus = latestPayment.payment_status;
//      console.log("Payment status from Cashfree:", paymentStatus); 

//     if (paymentStatus === "SUCCESS") {
//       await Order.update({ status: "SUCCESSFUL" }, { where: { orderId } });
//       const order = await Order.findOne({ where: { orderId } });
//       if (order) {
//         await User.update({ isPremiumUser: true }, { where: { id: order.userId } });
//       }
//       return res.status(200).json({ success: true, message: "Transaction successful!" });
    
//     } else {
//       await Order.update({ status: "FAILED" }, { where: { orderId } });
//       return res.status(200).json({ success: false, message: "TRANSACTION FAILED" });
//     }
//   } catch (err) {
//     console.log("Verify Payment Error =>", err);
//     const { orderId } = req.body;
//     if (orderId) {
//       await Order.update({ status: "FAILED" }, { where: { orderId } });
//     }
//     res.status(500).json({ message: "Verification failed", error: err.message });
//   }
// };

// module.exports = { verifyPayment };

const Order = require("../models/orderModels");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "orderId is required",
      });
    }

    const paymentResponse = await cashfree.PGOrderFetchPayments(orderId);
    const payments = paymentResponse.data;

    console.log("Payments data:", JSON.stringify(payments));

    if (!payments || payments.length === 0) {
      await Order.update(
        { status: "FAILED" },
        { where: { orderId } }
      );

      return res.status(200).json({
        success: false,
        message: "TRANSACTION FAILED",
      });
    }

    const latestPayment = payments[payments.length - 1];
    const paymentStatus = latestPayment.payment_status;

    console.log("Payment status from Cashfree:", paymentStatus);

    if (paymentStatus === "SUCCESS") {

      await Order.update(
        { status: "SUCCESSFUL" },
        { where: { orderId } }
      );

      const order = await Order.findOne({
        where: { orderId },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      await User.update(
        { isPremiumUser: true },
        { where: { id: order.userId } }
      );

      const user = await User.findByPk(order.userId);

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          isPremiumUser: user.isPremiumUser,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "15min",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Transaction successful!",
        token,
      });

    } else {

      await Order.update(
        { status: "FAILED" },
        { where: { orderId } }
      );

      return res.status(200).json({
        success: false,
        message: "TRANSACTION FAILED",
      });
    }

  } catch (err) {
    console.log("Verify Payment Error =>", err);

    const { orderId } = req.body;

    if (orderId) {
      await Order.update(
        { status: "FAILED" },
        { where: { orderId } }
      );
    }

    return res.status(500).json({
      message: "Verification failed",
      error: err.message,
    });
  }
};

module.exports = {
  verifyPayment,
};