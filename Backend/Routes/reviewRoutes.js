import express from "express";

import authUser from "../Middleware/auth.js";

import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../Controller/reviewController.js";

const router = express.Router();

// Get reviews of a product
router.get("/:productId", getProductReviews);

// Add review
router.post("/:productId", authUser, addReview);

// Update review
router.put("/:reviewId", authUser, updateReview);

// Delete review
router.delete("/:reviewId", authUser, deleteReview);

export default router;