import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';

const ForgetPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [webmailLink, setWebmailLink] = useState('');
  const navigate = useNavigate();

  const getWebmailLink = email => {
    const domain = email.split('@')[1];
    if (domain) {
      const lowerDomain = domain.toLowerCase();
      if (lowerDomain.includes('gmail')) {
        return 'https://mail.google.com/';
      } else if (lowerDomain.includes('yahoo')) {
        return 'https://mail.yahoo.com/';
      } else if (
        lowerDomain.includes('outlook') ||
        lowerDomain.includes('hotmail') ||
        lowerDomain.includes('live')
      ) {
        return 'https://outlook.live.com/';
      }
    }

    return 'mailto:';
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setWebmailLink('');

    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Please check your inbox.');

      setWebmailLink(getWebmailLink(email));

      setEmail('');

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else {
        setError('Failed to send reset email. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <title>Reset Password</title>
      <Navbar></Navbar>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm space-y-3">
                <p className="font-semibold">{success}</p>

                {webmailLink && (
                  <a
                    href={webmailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                  >
                    Go to Inbox
                  </a>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                } transition duration-150 ease-in-out`}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                Back to Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default ForgetPassword;
