import express from "express";

import authUser from "../Middleware/auth.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controller/wishlistController.js";

const router = express.Router();

// Get Wishlist
router.get("/", authUser, getWishlist);

// Add Product
router.post("/:productId", authUser, addToWishlist);

// Remove Product
router.delete("/:productId", authUser, removeFromWishlist);

export default router;