import fs from 'fs';
import bcrypt from 'bcryptjs';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import User from '../models/user.js';
import genToken from '../utils/token.js';
import { sendOTPEmail } from '../utils/mail.js';
import dotenv from 'dotenv';
dotenv.config();
let firebaseAdminReady = false;

const initFirebaseAdmin = () => {
    if (admin.getApps().length > 0) {
        firebaseAdminReady = true;
        return;
    }

    try {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
            const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
            admin.initializeApp({
                credential: admin.cert(serviceAccount),
                projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || 'feastly-80f01'
            });
            firebaseAdminReady = true;
            return;
        }

        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            admin.initializeApp({
                credential: admin.cert(serviceAccount),
                projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || 'feastly-80f01'
            });
            firebaseAdminReady = true;
            return;
        }

        console.warn('Firebase Admin is not configured. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON for Google auth.');
    } catch (error) {
        console.warn('Firebase Admin initialization failed:', error.message);
    }
};

initFirebaseAdmin();

const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            mobile,
            role
        } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                message: 'Name, email, password, and mobile are required'
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

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            if (userExists.authProviders?.includes('google')) {
                return res.status(400).json({
                    message: 'This email is already registered with Google Sign-In. Please use Google login instead.'
                });
            }

            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName: name,
            email: normalizedEmail,
            password: hashedPassword,
            mobile,
            role: role || 'user',
            authProvider: 'local',
            authProviders: ['local']
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

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        if (user.authProviders?.includes('google') && !user.password) {
            return res.status(400).json({
                message: 'This account was created with Google. Please use Google Sign-In.'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || '');

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
        
        // Log OTP to console for testing/debugging
        console.log(`🔐 Password Reset OTP for ${email}: ${otp}`);
        
        // Send email asynchronously without blocking the response
        sendOTPEmail(email, otp).catch((emailError) => {
            console.error('Email send failed (non-blocking):', emailError.message);
        });
        
        return res.status(200).json({
            message: 'Password reset OTP sent successfully. Check console for OTP during testing.'
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

        // Verify OTP is valid and verified
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

        if (!user.isResetOTPVerified) {
            return res.status(400).json({
                message: 'OTP has not been verified'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear OTP fields
        user.password = hashedPassword;
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        user.isResetOTPVerified = false;
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
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                message: 'Firebase ID token is required'
            });
        }

        if (!firebaseAdminReady) {
            return res.status(500).json({
                message: 'Google authentication is not configured on the server. Add Firebase Admin credentials first.'
            });
        }

        const decodedToken = await getAuth().verifyIdToken(idToken);
        const email = decodedToken.email?.toLowerCase();
        const firebaseUid = decodedToken.uid;

        if (!email) {
            return res.status(400).json({
                message: 'Google email is required'
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                fullName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Google User',
                email,
                mobile: null,
                password: null,
                role: 'user',
                authProvider: 'google',
                authProviders: ['google'],
                googleId: firebaseUid,
                firebaseUid,
                isEmailVerified: decodedToken.email_verified || false
            });

            await user.save();
        } else {
            const providerList = user.authProviders || [];
            if (!providerList.includes('google')) {
                providerList.push('google');
                user.authProviders = providerList;
            }

            if (!user.googleId) user.googleId = firebaseUid;
            if (!user.firebaseUid) user.firebaseUid = firebaseUid;
            if (!user.fullName && decodedToken.name) user.fullName = decodedToken.name;
            if (!user.isEmailVerified && decodedToken.email_verified) user.isEmailVerified = true;

            await user.save();
        }

        const token = genToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Google authentication successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                authProvider: user.authProvider
            }
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        return res.status(401).json({
            message: 'Invalid or expired Firebase token',
            error: error.message
        });
    }
};



export { signup, signIn, signOut, forgotPassword, resetPassword, sendOTP , verifyOTP ,googleAuth};