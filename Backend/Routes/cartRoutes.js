import express from "express";
import authUser from "../Middleware/auth.js";

import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
} from "../Controller/cartController.js";

const router = express.Router();

router.post("/add", authUser, addToCart);

router.get("/", authUser, getCart);

router.put("/update", authUser, updateCart);

router.delete("/:id", authUser, removeCartItem);

export default router;