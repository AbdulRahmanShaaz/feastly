import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { serverUrl } from '../App.jsx';
import { auth } from '../firebase.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function SignIn() {
  const primaryColor = '#ff4d24';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      console.log(result.data);
      dispatch(setUserData(result.data));
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };
    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();

        const signInData = await axios.post(`${serverUrl}/api/auth/google-auth`, {
          idToken
        }, { withCredentials: true });

        console.log("Google sign-in result:", signInData.data)
        dispatch(setUserData(signInData.data));
        navigate("/");
      } catch (error) {
        console.error("Google sign-in error:", error);
        alert(error?.response?.data?.message || 'Google sign-in failed');
      }
    }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: bgColor }}>
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          feastly
        </h1>
        <p className="text-gray-600 mb-8">
          Sign In to your account to get started with delicious food deliveries
        </p>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your Email"
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter your Password"
              style={{ border: `1px solid ${borderColor}` }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              <span className="text-lg leading-none">
                {!showPass ? <FaEye /> : <FaEyeSlash />}
              </span>
            </button>
          </div>
        </div>
        <div className="text-right mb-4 text-[#ff4d2d] cursor-pointer hover:underline font-medium" onClick={() => navigate('/forgot-password')}>
          Forgot Password
        </div>
        <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <button className="w-full font-semibold py-2 rounded-lg transition duration-200 border border-gray-200 hover:bg-gray-200 hover:text-white cursor-pointer mt-4 flex items-center justify-center gap-2" onClick={handleGoogleSignIn}>
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        <p className="text-gray-600 mt-4 text-center" onClick={() => navigate('/signup')}>
          Create a new account{' '}
          <span className="text-orange-500 hover:underline cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
