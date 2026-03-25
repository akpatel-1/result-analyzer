import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { studentApi } from '../../api/student.api';

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await studentApi.requestOtp({ email });
      setShowOtpInput(true);
      setResendTimer(30);
    } catch (error) {
      setEmailError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!otp) {
      setOtpError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    try {
      setLoading(true);
      await studentApi.verifyOtp({ email, otp });
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.response?.data?.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer === 0) {
      try {
        setLoading(true);
        await studentApi.requestOtp({ email });
        setResendTimer(30);
      } catch (error) {
        setOtpError(error.response?.data?.message || 'Failed to resend OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setShowOtpInput(false);
    setOtp('');
    setOtpError('');
    setResendTimer(0);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          {/* Header Section (Moved inside the card) */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {showOtpInput ? 'Check your email' : 'Welcome back'}
            </h1>
            <p className="text-sm text-gray-500">
              {showOtpInput
                ? `We sent a verification code to ${email}`
                : 'Enter your email address to access your account'}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}
            className="space-y-6"
          >
            {!showOtpInput ? (
              /* --- EMAIL STEP --- */
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="student@university.edu"
                      disabled={loading}
                      className={`block w-full pl-11 pr-4 py-3 rounded-xl border ${
                        emailError
                          ? 'border-red-300 ring-4 ring-red-50'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
                      } bg-gray-50 focus:bg-white text-gray-900 transition-all duration-200 outline-none sm:text-sm`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                      </svg>
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-65 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                >
                  {loading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {loading ? 'Sending Code...' : 'Continue with Email'}
                </button>
              </div>
            ) : (
              /* --- OTP STEP --- */
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1.5 text-center"
                  >
                    Enter the 6-digit code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6);
                      setOtp(value);
                      if (otpError) setOtpError('');
                    }}
                    placeholder="000000"
                    maxLength="6"
                    disabled={loading}
                    className={`block w-full py-4 text-center text-3xl tracking-[0.5em] font-bold rounded-xl border ${
                      otpError
                        ? 'border-red-300 ring-4 ring-red-50'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
                    } bg-gray-50 focus:bg-white text-gray-900 transition-all duration-200 outline-none`}
                  />
                  {otpError && (
                    <p className="mt-2 text-sm text-red-600 flex justify-center items-center gap-1.5 font-medium">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                      </svg>
                      {otpError}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-65 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                  >
                    {loading && (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  >
                    Use a different email
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0 || loading}
                      className="font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                    >
                      {resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : 'Click to resend'}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-gray-400">
          By signing in, you agree to our{' '}
          <a
            href="#"
            className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
