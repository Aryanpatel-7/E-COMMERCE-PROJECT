
import express from "express";
import authUser from "../Middleware/auth.js";
import adminAuth from "../Middleware/admin.js";
import { getAdminDashboard } from "../Controller/adminDashboardController.js";

const router = express.Router();

router.get("/", authUser, adminAuth, getAdminDashboard);

export default router;
