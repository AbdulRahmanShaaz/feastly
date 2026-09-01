import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from './config/database.js'
import cookieParser from "cookie-parser"
import authRouter from "./routes/AuthRoutes.js"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:5713"],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.listen(PORT, async () => {
    await connectDB()
    console.log(`Server is running on port ${PORT}`)
})
