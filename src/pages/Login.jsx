// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
  FaBus,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaArrowRight,
  FaUserPlus,
  FaKey,
  FaSpinner,
} from 'react-icons/fa';
// import { useAuth } from '../contexts/AuthProvider';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthProvider';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('🎉 Login successful! Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin();
      toast.success('✅ Google login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@ticketbari.com',
      password: 'Demo@123',
    });
    toast.success('Demo credentials filled! Click Login to continue.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <FaBus className="text-white text-3xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <FaKey className="text-white text-xs" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] bg-clip-text text-transparent animate-gradient">
            Welcome Back!
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
            Sign in to your TicketBari account and continue your journey with us
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Top Gradient Bar */}
          <div className="h-2 bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B]"></div>

          <div className="p-8 space-y-8">
            {/* Demo Login Button */}
            <div className="text-center">
              <button
                onClick={handleDemoLogin}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaKey className="mr-2 text-[#FF7A1B]" />
                Try Demo Account
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-[#FF7A1B]" />
                    Email Address
                  </div>
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-4 pl-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FFA53A]/30 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                    placeholder="you@example.com"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7A1B]" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center">
                    <FaLock className="mr-2 text-[#FF7A1B]" />
                    Password
                  </div>
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FFA53A]/30 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-5 w-5 text-[#FFA53A] focus:ring-[#FFA53A] border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-[#FF7A1B] hover:text-[#FFA53A] transition-colors duration-200 flex items-center"
                  >
                    Forgot password?
                    <FaArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#FFA53A] via-[#FF8A2B] to-[#FF7A1B] hover:from-[#FF8A2B] hover:via-[#FF7A1B] hover:to-[#FF6A0B] focus:outline-none focus:ring-4 focus:ring-[#FFA53A]/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <FaSignInAlt className="mr-3 h-5 w-5" />
                    Sign In
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaArrowRight className="h-4 w-4" />
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FcGoogle className="w-6 h-6 mr-3" />
              <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                Sign in with Google
              </span>
            </button>
          </div>

          {/* Bottom Section */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 rounded-b-3xl">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-[#FF7A1B] hover:text-[#FFA53A] transition-colors duration-200 inline-flex items-center group"
                >
                  <span>Sign up now</span>
                  <FaUserPlus className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-[#FF7A1B] hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#FF7A1B] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Secure Login
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <p className="text-xs font-medium text-green-600 dark:text-green-400">
              Instant Access
            </p>
          </div>
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

export default Login;
