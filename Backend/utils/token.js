import jwt from "jsonwebtoken";
const genToken = (id) => {
    try {
        return jwt.sign({
            userId: id,
        }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
    } catch (error) {
        throw new Error("Error generating token");
    }
}
export default genToken;