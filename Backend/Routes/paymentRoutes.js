import express from "express";

import authUser from "../Middleware/auth.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../Controller/paymentController.js";

const router = express.Router();

router.post("/create", authUser, createPaymentOrder);

router.post("/verify", authUser, verifyPayment);

export default router;