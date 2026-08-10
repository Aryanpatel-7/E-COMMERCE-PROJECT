import express from "express";

import authUser from "../Middleware/auth.js";
import adminAuth from "../Middleware/admin.js";

import {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../Controller/categoryController.js";

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getSingleCategory);

// Admin
router.post("/", authUser, adminAuth, createCategory);
router.put("/:id", authUser, adminAuth, updateCategory);
router.delete("/:id", authUser, adminAuth, deleteCategory);

export default router;