import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { serverUrl } from '../App.jsx'
import { auth } from '../firebase.js'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

function SignUp() {
  const primaryColor = "#ff4d24";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState("user")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSignUp = async () => {
      setError("")
      setLoading(true)
      
      // Validation
      if (!fullName.trim()) {
        setError("Full name is required")
        setLoading(false)
        return
      }
      
      if (!email.trim()) {
        setError("Email is required")
        setLoading(false)
        return
      }
      
      if (!mobile.trim()) {
        setError("Mobile number is required")
        setLoading(false)
        return
      }
      
      if (mobile.length < 10) {
        setError("Mobile number must be at least 10 digits")
        setLoading(false)
        return
      }
      
      if (!password.trim()) {
        setError("Password is required")
        setLoading(false)
        return
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setLoading(false)
        return
      }

      try{
        const result = await axios.post(`${serverUrl}/api/auth/signup`, {
          name: fullName,
          email,
          mobile,
          password,
          role
        },{withCredentials:true});
        console.log(result.data)
        navigate("/signin");
      } catch (error) {
        console.log(error)
        setError(error?.response?.data?.message || "Sign-up error occurred")
        console.error("Sign-up error:", error);
      } finally {
        setLoading(false)
      }
  }
  const handleGoogleSignUp = async () => {
    setError("")
    setLoading(true)
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const signUpData = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        idToken
      }, {withCredentials: true});
      
      console.log("Google sign-up result:", signUpData.data)
      navigate("/");
    } catch (error) {
      console.error("Google sign-up error:", error);
      setError(error?.response?.data?.message || "Google sign-up failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 " style={{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-xl shadow-lg  w-full max-w-md p-8 border`} style={{
        border: `1px solid ${borderColor}`
      }} >
        <h1 className={'text-3xl font-bold mb-2'} style={{
          color: primaryColor
        }}>feastly</h1>
        <p className='text-gray-600 mb-8'>Create your account to get started with delicious food deliveries</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* fullname */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500" placeholder='Enter your Full Name'
            style={{
              border: `1px solid ${borderColor}`
            }} />

        </div>
        {/* email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500" placeholder='Enter your Email'
            style={{
              border: `1px solid ${borderColor}`
            }} />

        </div>
        {/* mobile */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500" placeholder='Enter your Mobile Number'
            style={{
              border: `1px solid ${borderColor}`
            }} />

        </div>
        {/* password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>  
          <div className='relative'>
            <input
              type={`${showPass?"text":"password"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500" placeholder='Enter your Password'
              style={{
                border: `1px solid ${borderColor}`
              }} />
            <button type='button' className='absolute cursor-pointer right-3 top-3.75 text-gray-500' onClick={() => setShowPass(!showPass)}>{!showPass ? <FaEye /> : <FaEyeSlash /> }</button>
          </div>
        </div>

              {/* role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>  
          <div className='flex gap-2'>
            {["user","owner","deliverBoy"].map((r)=>{
              return <button key={r} className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'
              onClick={()=>setRole(r)}
              style={
                role==r?{backgroundColor:primaryColor,color:"white"}
                :{border:`1px solid ${primaryColor}`,color:primaryColor}
              }>{r}</button>
            })}
          </div>
        </div>
        <button 
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70" 
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <button 
          className="w-full font-semibold py-2 rounded-lg transition duration-200  border border-gray-200 hover:bg-gray-200 hover:text-white cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-70" 
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <FcGoogle size={20} />
          <span>{loading ? 'Signing Up...' : 'Sign Up with Google'}</span>
        </button>
            <p className='text-gray-600 mt-4 text-center' onClick={() => navigate("/signin")}>
            Already have an account? <span className="text-orange-500 hover:underline cursor-pointer">Sign In</span>
            </p>
      </div>
    </div>

  )
}

export default SignUp