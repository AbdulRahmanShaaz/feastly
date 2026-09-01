import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
export const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,   
        to,
        subject: "Password Reset OTP Code",
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    };  
    await transporter.sendMail(mailOptions);
};