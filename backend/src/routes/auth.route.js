import express from "express";
import { login, logout, signup, updateProfile,checkAuth } from "../controllers/auth.controller.js";
const router =express.Router();
import {protectRoute} from "../middleware/auth.middleware.js";

router.post("/signup", signup); 

router.post("/login",login );

router.post("/logout",logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
