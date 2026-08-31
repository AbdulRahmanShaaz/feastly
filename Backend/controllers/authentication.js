import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import genToken from '../utils/token.js';

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
export { signup, signIn, signOut };