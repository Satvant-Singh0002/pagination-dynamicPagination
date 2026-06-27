const Order = require("../models/orderModels");
const User = require('../models/userModels');
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

const buyPremium = async (req, res) => {
  try {
    const order = await Order.create({
      status: "PENDING",
      userId: req.user.userId,
    });
    const cashFreeOrderId = `order_${order.id}_${Date.now()}`;
    await order.update({ orderId: cashFreeOrderId });

    const request = {
      order_amount: 1000,
      order_currency: "INR",
      order_id: cashFreeOrderId,
      customer_details: {
        customer_id: req.user.userId.toString(),
        customer_phone: "8057733158"
      },
      order_meta: {
        return_url: "http://127.0.0.1:5501/frontend/expense.html?order_id={order_id}",
      },
    };

    const cashfreeResponse = await cashfree.PGCreateOrder(request);

    res.status(200).json({
      payment_session_id: cashfreeResponse.data.payment_session_id,
      order_id: cashfreeResponse.data.order_id
    });

  } catch (err) {
    console.log("Cashfree Error =>", err);
    res.status(500).json({
      message: "something went wrong",
      error: err.message
    });
  }
};

// Naya function — user return_url pe wapas aane ke baad ye call hoga
const verifyPayment = async (req, res) => {
  try {
    const { order_id } = req.query; // ya req.body, jaisa frontend bhejega

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    // Cashfree se actual order status fetch karo (DB pe trust mat karo)
    const cashfreeOrder = await cashfree.PGFetchOrder(order_id);
    const cfStatus = cashfreeOrder.data.order_status; // "PAID", "ACTIVE", "EXPIRED", "TERMINATED"

    const order = await Order.findOne({ where: { orderId: order_id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let newStatus;
    let premiumValue;

    if (cfStatus === "PAID") {
      newStatus = "SUCCESSFUL";
      premiumValue = 1;
    } else if (cfStatus === "EXPIRED" || cfStatus === "TERMINATED") {
      newStatus = "FAILED";
      premiumValue = 0;
    } else {
      newStatus = "PENDING";
      premiumValue = null;
    }

    await order.update({ status: newStatus });

    if (premiumValue !== null) {
      await User.update(
        { isPremiumUser: premiumValue },
        { where: { id: order.userId } }
      );
    }

    res.status(200).json({
      status: newStatus,
      isPremiumUser: premiumValue
    });

  } catch (err) {
    console.log("Verify Payment Error =>", err);
    res.status(500).json({
      message: "something went wrong",
      error: err.message
    });
  }
};

module.exports = {
  buyPremium,
  verifyPayment
};