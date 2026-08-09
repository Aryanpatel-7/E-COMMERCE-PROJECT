import express from 'express';
import { getProfile, loginUser, signupUser } from "../Controller/userController.js";
import authUser from '../Middleware/auth.js';

const router =express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);

router.get("/profile",authUser,getProfile);

export default router;