import express from "express"
import isAuth from "../middlewares/authmiddleware.js"
import { manageShop } from "../controllers/shopContoller.js"
import { upload } from "../middlewares/multer.js"

const shopRouter = express.Router();

shopRouter.post("/create-update-shop", upload.single("image"), isAuth, manageShop);

export default shopRouter;