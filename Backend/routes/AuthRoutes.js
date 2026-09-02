import express from "express";
import { signup, signIn, signOut, forgotPassword, resetPassword , verifyOTP, sendOTP,googleAuth } from "../controllers/authentication.js";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/signout", signOut);
authRouter.post("/google-auth", googleAuth);

export default authRouter;
