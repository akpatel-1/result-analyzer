import { useState } from 'react';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call your OTP sending API endpoint
      // const { error } = await sendOtpToEmail(email);
      // if (error) throw error;

      // For now, simulating OTP sent
      console.log('OTP sent to:', email);
      setShowOtpInput(true);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      setEmailError(error.message || 'Failed to send OTP');
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

    try {
      setLoading(true);
      // TODO: Call your OTP verification API endpoint
      // const { error, data } = await verifyOtp(email, otp);
      // if (error) throw error;

      console.log('Verifying OTP:', email, otp);
      // On success, redirect user or set authenticated state
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      setOtpError(error.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowOtpInput(false);
    setOtp('');
    setOtpError('');
  };

  return (
    <div className="relative min-h-screen bg-gray-200 flex flex-col items-center justify-center overflow-hidden">
      {/* ── Minimal white background ── */}

      {/* ── Content ── */}
      <div className="w-full px-4 flex justify-center">
        <form
          className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8 shadow-sm"
          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          <h1
            className="text-gray-900 text-3xl sm:text-4xl font-semibold text-center leading-tight mb-2"
            style={{
              letterSpacing: '-0.5px',
            }}
          >
            {showOtpInput ? 'Enter OTP' : 'Sign In'}
          </h1>

          <p className="text-gray-600 text-sm text-center mb-8">
            {showOtpInput
              ? `We've sent an OTP to ${email}`
              : 'Enter your email to receive an OTP'}
          </p>

          {/* ── Email/OTP Form ── */}
          {!showOtpInput ? (
            <>
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  disabled={loading}
                />
                {emailError && (
                  <p className="mt-2 text-red-500 text-xs">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                onClick={handleSendOtp}
                disabled={loading}
                className="
                  w-full py-3 px-6 rounded-lg
                  bg-blue-600 hover:bg-blue-700
                  text-white text-[15px] font-medium
                  transition-all duration-200
                  hover:scale-[1.01]
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                <span className="tracking-wide">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </span>
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError('');
                  }}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-center text-2xl tracking-widest"
                  disabled={loading}
                />
                {otpError && (
                  <p className="mt-2 text-red-500 text-xs">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="
                  w-full py-3 px-6 rounded-lg
                  bg-blue-600 hover:bg-blue-700
                  text-white text-[15px] font-medium
                  transition-all duration-200
                  hover:scale-[1.01]
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                <span className="tracking-wide">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="
                  w-full mt-3 py-2 px-4 rounded-lg
                  bg-gray-100 border border-gray-200 hover:bg-gray-200
                  text-gray-600 hover:text-gray-900 text-sm
                  transition-all duration-200
                "
              >
                Back
              </button>
            </>
          )}

          {/* Terms */}
          <p className="mt-6 text-gray-500 text-xs text-center">
            By continuing, you agree to our{' '}
            <a
              href="#"
              className="underline underline-offset-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="underline underline-offset-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
