import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
// import { useTheme } from '../contexts/ThemeContext';
// import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useTheme } from '../../hooks/useTheme';
import { AuthContext } from '../../AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = () => {
    const { password, confirmPassword } = formData;

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const error = validatePassword();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      await createUser(formData.name, formData.email, formData.password);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error('Google sign-up failed');
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
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1
            className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Create Account
          </h1>
          <p
            className={`mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Join TicketBari and start your journey
          </p>
        </div>

        {/* Register Form */}
        <div
          className={`rounded-2xl shadow-xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaUser
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Password
                </label>
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                <div className="mt-2 text-xs text-gray-500">
                  Must contain: uppercase, lowercase, and 6+ characters
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Confirm Password
                </label>
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
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="••••••••"
                    required
                  />
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
                {loading ? 'Creating Account...' : 'Create Account'}
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
                    Or sign up with
                  </span>
                </div>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border-2 font-medium transition-all bg-white text-gray-700 hover:bg-gray-50"
            >
              <FaGoogle className="text-red-500" />
              Sign up with Google
            </button>

            {/* Login Link */}
            <div
              className={`mt-8 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className={`font-medium ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
