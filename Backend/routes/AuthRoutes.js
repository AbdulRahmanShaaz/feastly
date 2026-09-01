import express from "express";
import { signup, signIn, signOut, forgotPassword, resetPassword , verifyOTP } from "../controllers/authentication.js";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-otp",verifyOTP)
authRouter.get("/signout", signOut);

export default authRouter;