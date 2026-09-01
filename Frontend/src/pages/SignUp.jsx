import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { serverUrl } from '../App.jsx'

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
  const navigate = useNavigate();

  const handleSignUp = async () => {
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
        console.error("Sign-up error:", error);
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
        <button className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer" onClick={handleSignUp}>
          Sign Up
        </button>
        <button className="w-full font-semibold py-2 rounded-lg transition duration-200  border border-gray-200 hover:bg-gray-200 hover:text-white cursor-pointer mt-2 flex items-center justify-center gap-2">
          <FcGoogle size={20} />
          <span>Sign Up with Google</span>
        </button>
            <p className='text-gray-600 mt-4 text-center' onClick={() => navigate("/signin")}>
            Already have an account? <span className="text-orange-500 hover:underline cursor-pointer">Sign In</span>
            </p>
      </div>
    </div>

  )
}

export default SignUp