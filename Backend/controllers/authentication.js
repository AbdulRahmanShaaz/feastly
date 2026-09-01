import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import genToken from '../utils/token.js';
import { sendOTPEmail } from '../utils/mail.js';
const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            mobile,
            role
        } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        if (mobile.length < 10) {
            return res.status(400).json({
                message: 'Mobile number must be at least 10 digits long'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName: name,
            email,
            password: hashedPassword,
            mobile,
            role
        });

        await user.save();

        const token = genToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: 'User created successfully',
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            message: 'An error occurred during signup',
            error: error.message
        });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Incorrect password entered'
            });
        }

        const token = genToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({
            message: 'An error occurred during signin',
            error: error.message
        });
    }
};
const signOut = async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({
            message:"log out successfully"
        })
    }catch(error){
        return res.status(500).json({
            message:`sign In error ${error}`
        })
    }
}
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body; 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();
        await sendOTPEmail(email, otp);
        return res.status(200).json({
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({
            message: 'An error occurred while sending OTP',
            error: error.message
        });
    }
};
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        if (user.resetOTP !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }
        if (user.resetOTPExpiry < Date.now()) {
            return res.status(400).json({
                message: 'OTP has expired'
            });
        }
        user.isResetOTPVerified = true;
        await user.save();
        return res.status(200).json({
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            message: 'An error occurred while verifying OTP',
            error: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: 'If an account with that email exists, a reset link has been sent.'
            });
        }

        return res.status(200).json({
            message: 'If an account with that email exists, a reset link has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({
                message: 'Email, OTP, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            message: 'An error occurred during password reset',
            error: error.message
        });
    }
};

export { signup, signIn, signOut, forgotPassword, resetPassword, sendOTP , verifyOTP };