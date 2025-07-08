const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");

// const authenticate = require("../middleware/authenticate");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/create-order
router.post("/create-order", async (req, res) => {
//   console.log("HIT /api/payment/create-order route");
  try {
    const { userId } = req.body;
    // console.log("Received userId:", userId);

    const user = await User.findById(userId);
    if (!user) {
    //   console.log("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }
    // console.log("User found:", user.email);

    // Pro plan: ₹399/month (in paise)
    const amount = 39900;
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `r_${userId.slice(-6)}_${Date.now()}`,
      payment_capture: 1,
    };
    // console.log("Razorpay order options:", options);

    const order = await razorpay.orders.create(options);
    // console.log("Razorpay order created:", order);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err); // <-- This should print the error!
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  }
});

// POST /api/payment/verify-payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update user to Pro
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isPro: true,
        razorpayCustomerId: razorpay_payment_id,
        subscriptionStatus: "active",
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      success: true,
      message: "Payment verified and subscription activated",
      user,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res
      .status(500)
      .json({ error: "Failed to verify payment", details: err.message });
  }
});

module.exports = router;
