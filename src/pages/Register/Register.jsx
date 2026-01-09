import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaBus,
  FaCheckCircle,
  FaUsers,
  FaStore,
  FaShieldAlt,
  FaTicketAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthProvider';
// import { useAuth } from '../../contexts/AuthProvider';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('user');
  const { register: signup, googlelogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  // Password validation function
  const validatePassword = value => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value))
      return 'Must contain at least one uppercase letter';
    if (!/[a-z]/.test(value))
      return 'Must contain at least one lowercase letter';
    return true;
  };

  // Email/password registration
  const onSubmit = async data => {
    try {
      setLoading(true);

      // Firebase signup
      const userCredential = await signup(data.email, data.password);
      const user = userCredential.user;

      // Register in MongoDB
      await axios.post('/api/users/register', {
        email: user.email,
        name: data.name,
        photoURL:
          data.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.name
          )}&background=random`,
        role: role,
      });

      toast.success('🎉 Registration successful! Welcome to TicketBari!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use')
        errorMessage = 'Email already in use';
      else if (error.code === 'auth/weak-password')
        errorMessage = 'Password is too weak';
      else if (error.code === 'auth/invalid-email')
        errorMessage = 'Invalid email address';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await googlelogin();

      await axios.post('/api/users/social-login', {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      });

      toast.success('✅ Registration successful with Google!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google registration error:', error);
      toast.error(error.message || 'Failed to register with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] rounded-2xl flex items-center justify-center shadow-2xl">
                <FaBus className="text-white text-4xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <FaUsers className="text-white text-sm" />
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] bg-clip-text text-transparent animate-gradient mb-3">
            Join TicketBari Family
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create your account and unlock exclusive travel experiences
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="md:flex">
            {/* Left Side - Benefits */}
            <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] p-10">
              <div className="text-white h-full flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-8 flex items-center">
                  <FaShieldAlt className="mr-3" />
                  Why Join TicketBari?
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start group">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <FaCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        Secure Booking
                      </h4>
                      <p className="text-white/80 text-sm">
                        End-to-end encrypted transactions
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <FaTicketAlt className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        Best Price Guarantee
                      </h4>
                      <p className="text-white/80 text-sm">
                        We'll match or beat any price
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <FaUsers className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        24/7 Support
                      </h4>
                      <p className="text-white/80 text-sm">
                        Dedicated customer service team
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-12 pt-8 border-t border-white/20">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold">1M+</span>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Happy Travelers</p>
                      <p className="text-lg font-semibold">
                        Trusted by millions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-3/5 p-8 md:p-12">
              {/* Social Register */}
              <div className="mb-8">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md group disabled:opacity-50"
                >
                  <FaGoogle className="mr-3 text-red-500 text-lg" />
                  <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    Sign up with Google
                  </span>
                </button>
              </div>

              <div className="relative mb-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Or register with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-[#FF7A1B]" />
                        Full Name
                      </div>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="pl-12 w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FFA53A]/30 bg-white dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                        placeholder="John Doe"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7A1B]" />
                      </div>
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <span className="mr-1">⚠</span> {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-[#FF7A1B]" />
                        Email Address
                      </div>
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className="pl-12 w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FFA53A]/30 bg-white dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                        placeholder="john@example.com"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7A1B]" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <span className="mr-1">⚠</span> {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <FaImage className="mr-2 text-[#FF7A1B]" />
                      Profile Photo URL{' '}
                      <span className="text-gray-500 text-xs ml-2">
                        (Optional)
                      </span>
                    </div>
                  </label>
                  <div className="relative group">
                    <input
                      type="url"
                      {...register('photoURL')}
                      className="pl-12 w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FFA53A]/30 bg-white dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      placeholder="https://example.com/photo.jpg"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <FaImage className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7A1B]" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Leave blank for auto-generated avatar
                  </p>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <FaLock className="mr-2 text-[#FF7A1B]" />
                        Password
                      </div>
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          validate: validatePassword,
                        })}
                        className="pl-12 pr-12 w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FFA53A]/30 bg-white dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                        placeholder="••••••••"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7A1B]" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-[#FF7A1B]" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-[#FF7A1B]" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <span className="mr-1">⚠</span>{' '}
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <FaLock className="mr-2 text-[#FF7A1B]" />
                        Confirm Password
                      </div>
                    </label>
                    <div className="relative group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value =>
                            value === password || 'Passwords do not match',
                        })}
                        className={`pl-12 pr-12 w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA53A]/30 bg-white dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                          password &&
                          watch('confirmPassword') &&
                          password !== watch('confirmPassword')
                            ? 'border-red-300 dark:border-red-500'
                            : 'border-gray-200 dark:border-gray-600 group-hover:border-gray-300 dark:group-hover:border-gray-500'
                        }`}
                        placeholder="••••••••"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7A1B]" />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-[#FF7A1B]" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-[#FF7A1B]" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <span className="mr-1">⚠</span>{' '}
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={`p-6 border-2 rounded-xl text-left transition-all duration-300 group ${
                        role === 'user'
                          ? 'border-[#FF7A1B] bg-gradient-to-r from-[#FFA53A]/10 to-[#FF7A1B]/10 dark:from-[#FFA53A]/20 dark:to-[#FF7A1B]/20 shadow-lg scale-105'
                          : 'border-gray-200 dark:border-gray-600 hover:border-[#FFA53A] dark:hover:border-[#FF8A2B] hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                            role === 'user'
                              ? 'bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B]'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <FaUsers
                            className={`text-xl ${
                              role === 'user' ? 'text-white' : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            Traveler
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Book tickets
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Perfect for individuals who want to book bus tickets
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('vendor')}
                      className={`p-6 border-2 rounded-xl text-left transition-all duration-300 group ${
                        role === 'vendor'
                          ? 'border-green-500 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 shadow-lg scale-105'
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                            role === 'vendor'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <FaStore
                            className={`text-xl ${
                              role === 'vendor' ? 'text-white' : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            Vendor
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Sell tickets
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        For businesses who want to list and sell bus tickets
                      </p>
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('terms', {
                      required: 'You must accept the terms and conditions',
                    })}
                    className="h-5 w-5 mt-1 text-[#FFA53A] focus:ring-[#FFA53A] border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="font-semibold text-[#FF7A1B] hover:text-[#FFA53A] transition-colors duration-200"
                    >
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy"
                      className="font-semibold text-[#FF7A1B] hover:text-[#FFA53A] transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <span className="mr-1">⚠</span> {errors.terms.message}
                  </p>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center py-5 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] hover:from-[#FF8A2B] hover:via-[#FF7A1B] hover:to-[#FF6A0B] focus:outline-none focus:ring-4 focus:ring-[#FFA53A]/40 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg
                          className="ml-3 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-[#FF7A1B] hover:text-[#FFA53A] transition-colors duration-200 inline-flex items-center group"
                  >
                    <span>Sign in here</span>
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;
