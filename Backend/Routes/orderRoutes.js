import express from "express";
import authUser from "../Middleware/auth.js";
import adminAuth from "../Middleware/admin.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../Controller/orderController.js";

const router = express.Router();

router.post("/", authUser, placeOrder);

router.get("/myorders", authUser, getMyOrders);

router.get("/",authUser,adminAuth,getAllOrders);
router.put("/:id",authUser,adminAuth,updateOrderStatus);


export default router;