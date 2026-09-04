import express from "express"
import { getCurrentUser } from "../controllers/userController.js"
import isAuth from "../middlewares/authmiddleware.js"
const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

export default userRouter;