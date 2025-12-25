import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthProvider';
// import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, googleLogin, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // 🔁 Redirect after role loaded
  useEffect(() => {
    if (!userRole) return;

    if (userRole === 'admin') {
      navigate('/admin-dashboard/profile', { replace: true });
    } else if (userRole === 'vendor') {
      navigate('/vendor-dashboard/profile', { replace: true });
    } else {
      navigate('/user-dashboard/profile', { replace: true });
    }
  }, [userRole, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password); // ✅ only once
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin();
      toast.success('Google login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-4 py-2 border rounded flex justify-center items-center"
        >
          <FaGoogle className="mr-2" /> Login with Google
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
