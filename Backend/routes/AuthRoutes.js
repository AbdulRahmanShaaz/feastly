import express from "express";
import { signup, signIn, signOut } from "../controllers/authentication.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);

export default authRouter;