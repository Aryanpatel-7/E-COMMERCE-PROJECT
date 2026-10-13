import express from "express";
import authUser from "../Middleware/auth.js";
import adminAuth from "../Middleware/admin.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
   getOrderById,
  updateOrderStatus,
} from "../Controller/orderController.js";

const router = express.Router();

router.post("/", authUser, placeOrder);

router.get("/myorders", authUser, getMyOrders);

router.get("/all",authUser,adminAuth,getAllOrders);
router.put("/:id",authUser,adminAuth,updateOrderStatus);


// Get one order's details
router.get("/:id", authUser, getOrderById);

export default router;