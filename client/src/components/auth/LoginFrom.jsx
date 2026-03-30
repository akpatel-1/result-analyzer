import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdErrorOutline, MdOutlineEmail } from 'react-icons/md';
import { PiWarningCircle } from 'react-icons/pi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { loginSchema } from '../../utils/login.schema';

export default function LoginForm({ onSubmit, userType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentialError, setCredentialError] = useState({
    emailError: '',
    passwordError: '',
  });
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentialError((prev) => ({ ...prev, [`${name}Error`]: '' }));
    setServerError('');
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'email' ? value.trim() : value,
    }));
  };

  const validateCredentials = (e) => {
    const { name, value } = e.target;
    const fieldSchema = loginSchema.shape[name];
    if (!fieldSchema) return;
    const result = fieldSchema.safeParse(value);
    setCredentialError((prev) => ({
      ...prev,
      [`${name}Error`]: result.success
        ? ''
        : result.error.issues[0]?.message || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setCredentialError({ emailError: '', passwordError: '' });
    setServerError('');

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setCredentialError({
        emailError: fieldErrors.email?.[0] || '',
        passwordError: fieldErrors.password?.[0] || '',
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message;
      if (!err.response || status >= 500) {
        navigate('/error/500');
        return;
      }
      setServerError(
        errorMessage || 'Invalid credentials or connection issue.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-stone-100 bg-[radial-gradient(ellipse_60%_50%_at_15%_10%,#e0e7ff,transparent),radial-gradient(ellipse_50%_40%_at_85%_90%,#fce7f3,transparent)]">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_24px_48px_-12px_rgba(79,70,229,0.10)] p-10 w-full max-w-md animate-[fadeUp_0.45s_cubic-bezier(0.22,1,0.36,1)_both]">
        {/* Header */}
        <span className="inline-block bg-indigo-50 text-indigo-600 text-[0.7rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
          {userType}
        </span>
        <h1 className="font-['Instrument_Serif'] text-[2rem] leading-tight text-stone-900 mb-1">
          Welcome <em className="italic text-indigo-600">back</em>
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Sign in to continue to your account.
        </p>

        <div className="h-px bg-linear-to-r from-transparent via-stone-200 to-transparent mb-6" />

        {/* Server Error */}
        {serverError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5 text-red-600 text-[0.825rem] font-medium">
            <PiWarningCircle className="shrink-0 text-base" />
            {serverError}
          </div>
        )}

        {/* Form */}
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[0.8rem] font-semibold text-stone-700 tracking-tight"
            >
              Email address
            </label>
            <div className="relative flex items-center">
              <MdOutlineEmail className="absolute left-3 text-stone-400 text-[1.05rem] pointer-events-none peer-focus:text-indigo-500" />
              <input
                id="email"
                type="text"
                name="email"
                placeholder="you@example.com"
                required
                minLength={8}
                maxLength={50}
                value={formData.email}
                onChange={handleChange}
                onBlur={validateCredentials}
                className={`peer w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-stone-800 bg-stone-50 outline-none transition-all duration-200
                  placeholder:text-stone-300
                  focus:bg-white focus:ring-2 focus:ring-indigo-500/20
                  ${
                    credentialError.emailError
                      ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                      : 'border-stone-200 focus:border-indigo-500'
                  }`}
              />
            </div>
            {credentialError.emailError && (
              <p className="flex items-center gap-1 text-[0.775rem] text-red-600 font-medium animate-[fadeUp_0.18s_ease_both]">
                <MdErrorOutline /> {credentialError.emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[0.8rem] font-semibold text-stone-700 tracking-tight"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <RiLockPasswordLine className="absolute left-3 text-stone-400 text-[1.05rem] pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                required
                minLength={1}
                maxLength={128}
                value={formData.password}
                onChange={handleChange}
                onBlur={validateCredentials}
                className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm text-stone-800 bg-stone-50 outline-none transition-all duration-200
                  placeholder:text-stone-300
                  focus:bg-white focus:ring-2 focus:ring-indigo-500/20
                  ${
                    credentialError.passwordError
                      ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-500/15'
                      : 'border-stone-200 focus:border-indigo-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-stone-400 text-[1.1rem] flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {credentialError.passwordError && (
              <p className="flex items-center gap-1 text-[0.775rem] text-red-600 font-medium animate-[fadeUp_0.18s_ease_both]">
                <MdErrorOutline /> {credentialError.passwordError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <BiLoaderAlt className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
