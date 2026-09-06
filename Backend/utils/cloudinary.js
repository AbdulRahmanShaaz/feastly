import { v2 as cloudinary } from 'cloudinary'
import dotenv from "dotenv"
dotenv.config()
import fs from "fs"

const uploadOnCloudinary = async (localFilePath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const response = await cloudinary.uploader.upload(localFilePath)
        console.log("cloudinary response", response)
        fs.unlinkSync(localFilePath)
        return response.secure_url
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("error in cloudinary", error)
    }
}
export { uploadOnCloudinary }