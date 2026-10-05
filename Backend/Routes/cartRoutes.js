import express from "express";
import authUser from "../Middleware/auth.js";

import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart
} from "../Controller/cartController.js";

const router = express.Router();

router.post("/add", authUser, addToCart);

router.get("/", authUser, getCart);

router.put("/update", authUser, updateCart);

router.delete("/remove/:productId", authUser, removeCartItem);

router.delete("/clear", authUser, clearCart);

export default router;