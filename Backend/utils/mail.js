import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});
export const sendOTPEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,   
            to,
            subject: "Password Reset OTP Code",
            html: `<p>Your Password Reset OTP code is: <strong>${otp}</strong></p>`,
        };  
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${to}`);
    } catch (error) {
        console.error(`⚠️ Email sending failed for ${to}:`, error.message);
        // Don't throw - allow app to continue even if email fails
    }
};