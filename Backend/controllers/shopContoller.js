import uploadOnCloudinary from "../utils/cloudinary.js"
import Shop from "../models/shop.js"
export const manageShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body;
        // Use req.userId or req.user._id depending on your auth middleware
        const userId = req.user?._id || req.userId; 

        if (!name || !city || !state || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }
        let uploadedImage;
        if (req.file && req.file.path) {
            uploadedImage = await uploadOnCloudinary(req.file.path);
        }
        let isCreated = false;
        let shop = await Shop.findOne({ owner: userId });

        if (shop) {
            // Update existing shop
            const updateData = { name, city, state, address };
            if (uploadedImage) {
                updateData.image = uploadedImage;
            }      
            shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
        } else {
            // Create new shop
            if (!uploadedImage) {
                return res.status(400).json({ message: "Image is required to create a shop" });
            }
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image: uploadedImage,
                owner: userId
            });
            isCreated = true;
        }
        if (!shop) {
            return res.status(500).json({ message: "Something went wrong" });
        }
        console.log(shop);
        await shop.populate("owner");
        res.status(200).json({ 
            message: `Shop ${isCreated ? 'created' : 'updated'} successfully`, 
            shop 
        });
    } catch (error) {
        console.log("error in manageShop", error);
        res.status(500).json({ message: "Internal server error" });
    }
}