import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { serverUrl } from '../App.jsx';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setMessageType('success');
      setStep(2);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!otp.trim()) {
      setMessage('Please enter the OTP code.');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setMessageType('success');
      setStep(3);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to verify OTP. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!newPassword.trim()) {
      setMessage('Please enter a new password.');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, otp, password: newPassword },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setMessageType('success');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to reset password. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: '#fff9f6' }}>
      <div
        className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md border"
        style={{ border: '1px solid #ddd' }}
      >
        <button
          type="button"
          onClick={() => navigate('/signin')}
          className="absolute left-4 top-4 flex items-center justify-center rounded-full text-[#ff4d2d] hover:bg-orange-50 transition cursor-pointer"
          aria-label="Go back"
        >
          <IoIosArrowRoundBack size={30} />
        </button>

        <div className="pt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'Set New Password'}
          </h2>

          {step === 1 ? (
            <>
              <p className="text-gray-600 mb-6">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSendResetLink}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Enter your Email"
                  required
                />
              </div>

              {message && (
                <p className={`mb-4 text-sm font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
          ) : step === 2 ? (
            <>
              <p className="text-gray-600 mb-6">
                We sent a 6-digit OTP to <span className="font-medium text-gray-800">{email}</span>
              </p>

              <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-gray-700 font-medium mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 tracking-[0.4em] text-center"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
              </div>

              {message && (
                <p className={`mb-4 text-sm font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                className="w-full mt-3 text-sm text-[#ff4d2d] font-medium hover:underline cursor-pointer"
                onClick={() => setStep(1)}
              >
                Resend code
              </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {message && (
                <p className={`mb-4 text-sm font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;