import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdErrorOutline, MdOutlineEmail } from 'react-icons/md';
import { PiWarningCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

import { studentApi } from '../../api/student.api';

export default function StudentLoginForm() {
  const navigate = useNavigate();

  // --- State ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showOtp, setShowOtp] = useState(false); // toggle OTP visibility
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [serverError, setServerError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // --- Resend countdown timer ---
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // --- Validation ---
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return 'Please enter a valid email address';
    return '';
  };

  const validateOtp = (value) => {
    if (!value) return 'OTP is required';
    if (value.length !== 6) return 'OTP must be 6 digits';
    return '';
  };

  // --- Step 1: Send OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setServerError('');

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    try {
      setLoading(true);
      await studentApi.requestOtp({ email });
      setShowOtpStep(true);
      setResendTimer(60);
    } catch (err) {
      const status = err.response?.status;
      if (!err.response || status >= 500) {
        navigate('/error/500');
        return;
      }
      setServerError(
        err.response?.data?.message || 'Failed to send OTP. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setServerError('');

    const error = validateOtp(otp);
    if (error) {
      setOtpError(error);
      return;
    }

    try {
      setLoading(true);
      await studentApi.verifyOtp({ email, otp });
      navigate('/student/profile');
    } catch (err) {
      const status = err.response?.status;
      if (!err.response || status >= 500) {
        navigate('/error/500');
        return;
      }
      setOtpError(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Resend OTP ---
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setServerError('');
    setOtpError('');

    try {
      setLoading(true);
      await studentApi.requestOtp({ email });
      setResendTimer(30);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Failed to resend OTP. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Go back to email step ---
  const handleBack = () => {
    setShowOtpStep(false);
    setOtp('');
    setOtpError('');
    setServerError('');
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-stone-100 bg-[radial-gradient(ellipse_60%_50%_at_15%_10%,#e0e7ff,transparent),radial-gradient(ellipse_50%_40%_at_85%_90%,#fce7f3,transparent)]">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_24px_48px_-12px_rgba(79,70,229,0.10)] p-10 w-full max-w-md animate-[fadeUp_0.45s_cubic-bezier(0.22,1,0.36,1)_both]">
        {/* Header */}
        <span className="inline-block bg-indigo-50 text-indigo-600 text-[0.7rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
          Student
        </span>
        <h1 className="font-['Instrument_Serif'] text-[2rem] leading-tight text-stone-900 mb-1">
          {showOtpStep ? (
            <>
              Check your <em className="italic text-indigo-600">email</em>
            </>
          ) : (
            <>
              Welcome <em className="italic text-indigo-600">back</em>
            </>
          )}
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          {showOtpStep
            ? `We sent a 6-digit code to ${email}`
            : 'Enter your email address to receive a login code.'}
        </p>

        <div className="h-px bg-linear-to-r from-transparent via-stone-200 to-transparent mb-6" />

        {/* Server / generic error */}
        {serverError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5 text-red-600 text-[0.825rem] font-medium">
            <PiWarningCircle className="shrink-0 text-base" />
            {serverError}
          </div>
        )}

        {/* ── STEP 1: Email ── */}
        {!showOtpStep && (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSendOtp}
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[0.8rem] font-semibold text-stone-700 tracking-tight"
              >
                Email address
              </label>
              <div className="relative flex items-center">
                <MdOutlineEmail className="absolute left-3 text-stone-400 text-[1.05rem] pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="student@ssipmt.com"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                    setEmailError('');
                    setServerError('');
                  }}
                  onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                  className={`peer w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-stone-800 bg-stone-50 outline-none transition-all duration-200
                    placeholder:text-stone-300
                    focus:bg-white focus:ring-2 focus:ring-indigo-500/20
                    ${
                      emailError
                        ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                        : 'border-stone-200 focus:border-indigo-500'
                    }`}
                />
              </div>
              {emailError && (
                <p className="flex items-center gap-1 text-[0.775rem] text-red-600 font-medium animate-[fadeUp_0.18s_ease_both]">
                  <MdErrorOutline /> {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Continue with Email'
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {showOtpStep && (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleVerifyOtp}
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="otp"
                className="text-[0.8rem] font-semibold text-stone-700 tracking-tight"
              >
                6-digit verification code
              </label>
              <div className="relative flex items-center">
                {/* Reuse the eye toggle for OTP visibility — same UX pattern as password */}
                <input
                  id="otp"
                  type={showOtp ? 'text' : 'password'}
                  inputMode="numeric"
                  name="otp"
                  placeholder="••••••"
                  maxLength={6}
                  value={otp}
                  disabled={loading}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                    setOtpError('');
                    setServerError('');
                  }}
                  onBlur={(e) => setOtpError(validateOtp(e.target.value))}
                  className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm text-stone-800 bg-stone-50 outline-none transition-all duration-200 tracking-[0.35em] font-bold
                    placeholder:text-stone-300 placeholder:tracking-normal placeholder:font-normal
                    focus:bg-white focus:ring-2 focus:ring-indigo-500/20
                    ${
                      otpError
                        ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                        : 'border-stone-200 focus:border-indigo-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowOtp((p) => !p)}
                  aria-label={showOtp ? 'Hide code' : 'Show code'}
                  className="absolute right-3 text-stone-400 text-[1.1rem] flex items-center hover:text-indigo-500 transition-colors duration-200"
                >
                  {showOtp ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {otpError && (
                <p className="flex items-center gap-1 text-[0.775rem] text-red-600 font-medium animate-[fadeUp_0.18s_ease_both]">
                  <MdErrorOutline /> {otpError}
                </p>
              )}
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Sign In'
              )}
            </button>

            {/* Back link */}
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="text-sm text-stone-500 hover:text-indigo-600 transition-colors duration-200 text-center"
            >
              ← Use a different email
            </button>

            {/* Resend */}
            <div className="h-px bg-linear-to-r from-transparent via-stone-200 to-transparent" />
            <p className="text-center text-[0.8rem] text-stone-500">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-stone-400 transition-colors duration-200"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
