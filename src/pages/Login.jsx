import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
// import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthContext';
import { useTheme } from '../hooks/useTheme';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { singIn, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await singIn(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1
            className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Sign in to your TicketBari account
          </p>
        </div>

        {/* Login Form */}
        <div
          className={`rounded-2xl shadow-xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaEnvelope
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className={`text-sm ${
                      theme === 'dark'
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaLock
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        className={`h-5 w-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      />
                    ) : (
                      <FaEye
                        className={`h-5 w-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white shadow-lg hover:shadow-xl`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={`px-2 ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-white text-gray-500'
                    }`}
                  >
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border-2 font-medium transition-all bg-white text-gray-700 hover:bg-gray-50"
            >
              <FaGoogle className="text-red-500" />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div
              className={`mt-8 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className={`font-medium ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
