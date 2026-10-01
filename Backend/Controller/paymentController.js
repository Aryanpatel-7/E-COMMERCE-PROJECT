import crypto from "crypto";
import razorpay from "../Config/razorpay.js";
import Payment from "../Model/payment.js";
import Order from "../Model/order.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const amount = Number(order.totalAmount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    const payment = await Payment.create({
      user: userId,
      order: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: "INR",
      status: "created",
    });

    res.status(201).json({
      success: true,
      message: "Payment order created",
      payment,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("Create Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// verifypayment
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      user: userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = "paid";

    await payment.save();

    const order = await Order.findById(payment.order);

    if (order) {
      order.paymentStatus = "paid";
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};     