import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import {
  FaBus,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaHome,
  FaTicketAlt,
  FaTachometerAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
// import { useAuth } from '../../hooks/useAuth';
// import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { AuthContext } from '../../AuthContext';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'All Tickets', path: '/all-tickets', icon: <FaTicketAlt /> },
    {
      name: 'Dashboard',
      path: user ? '/dashboard' : '/login',
      icon: <FaTachometerAlt />,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-gray-900/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : theme === 'dark'
          ? 'bg-gray-900 py-4'
          : 'bg-gradient-to-r from-blue-600 to-blue-800 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <FaBus className="text-2xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TicketBari</h1>
              <p className="text-xs text-blue-100">Your Travel Partner</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-white hover:bg-white/10'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>

            {/* User/Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white">{user.name}</span>
                  <FaChevronDown className="text-white" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-3 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
              <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>

            {/* Auth Mobile */}
            {user ? (
              <>
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-3 bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
