// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaBus,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaStore,
  FaShieldAlt,
  FaTicketAlt,
  FaHome,
  FaSignOutAlt,
  FaChartBar,
  FaPlusCircle,
  FaUsers,
  FaSun,
  FaMoon,
  FaHistory,
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout, userRole, userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ---------- Resolve Role ----------
  const resolvedRole = userRole || userData?.role || user?.role || 'user';
  const isFraud = userData?.isFraud || false;

  const getRoleIcon = () => {
    if (resolvedRole === 'admin')
      return <FaShieldAlt className="w-4 h-4 text-purple-500" />;
    if (resolvedRole === 'vendor')
      return <FaStore className="w-4 h-4 text-green-500" />;
    return <FaUser className="w-4 h-4 text-blue-500" />;
  };

  // ---------- Dashboard Routes ----------
  const getDashboardRoutes = () => {
    if (!user) return [];

    switch (resolvedRole) {
      case 'admin':
        return [
          {
            path: '/admin-dashboard/profile',
            label: 'Admin Profile',
            icon: <FaUser />,
          },
          {
            path: '/admin-dashboard/manage-tickets',
            label: 'Manage Tickets',
            icon: <FaTicketAlt />,
          },
          {
            path: '/admin-dashboard/manage-users',
            label: 'Manage Users',
            icon: <FaUsers />,
          },
          {
            path: '/admin-dashboard/advertise-tickets',
            label: 'Advertise Tickets',
            icon: <FaChartBar />,
          },
        ];
      case 'vendor':
        return [
          {
            path: '/vendor-dashboard/profile',
            label: 'Vendor Profile',
            icon: <FaUser />,
          },
          {
            path: '/vendor-dashboard/add-ticket',
            label: 'Add Ticket',
            icon: <FaPlusCircle />,
          },
          {
            path: '/vendor-dashboard/my-tickets',
            label: 'My Added Tickets',
            icon: <FaTicketAlt />,
          },
          {
            path: '/vendor-dashboard/bookings',
            label: 'Requested Bookings',
            icon: <FaUsers />,
          },
          {
            path: '/vendor-dashboard/revenue',
            label: 'Revenue Overview',
            icon: <FaChartBar />,
          },
        ];
      default:
        return [
          { path: '/dashboard/profile', label: 'My Profile', icon: <FaUser /> },
          {
            path: '/dashboard/bookings',
            label: 'My Booked Tickets',
            icon: <FaTicketAlt />,
          },
          {
            path: '/dashboard/transactions',
            label: 'Transaction History',
            icon: <FaHistory />,
          },
        ];
    }
  };

  const getDashboardRoot = () => {
    switch (resolvedRole) {
      case 'admin':
        return '/admin-dashboard';
      case 'vendor':
        return '/vendor-dashboard';
      default:
        return '/dashboard';
    }
  };

  const getUserDisplayName = () => {
    return (
      user?.displayName?.split(' ')[0] ||
      userData?.name?.split(' ')[0] ||
      user?.email?.split('@')[0] ||
      'User'
    );
  };

  const getUserRoleLabel = () =>
    resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1);

  // ---------- Handlers ----------
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsOpen(false);
      setProfileDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Navbar.jsx-এ handleDashboardClick ফাংশনে
  const handleDashboardClick = () => {
    const role = resolvedRole;
    console.log('🎯 [Navbar] Dashboard click with role:', role);

    // Navigate based on role
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'vendor') {
      navigate('/vendor-dashboard');
    } else {
      navigate('/dashboard');
    }

    setProfileDropdown(false);
    setIsOpen(false);
  };
  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    {
      path: '/all-tickets',
      label: 'All Tickets',
      icon: <FaTicketAlt />,
      private: true,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg py-2'
          : 'bg-white dark:bg-gray-900 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <FaBus className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B]">
                  Ticket<span>Bari</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              if (link.private && !user) return null;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500'
                    }`
                  }
                >
                  <span className="mr-2 opacity-70 group-hover:opacity-100">
                    {link.icon}
                  </span>
                  {link.label}
                </NavLink>
              );
            })}

            {user && (
              <button
                onClick={handleDashboardClick}
                className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md ml-2"
              >
                <span className="mr-2">{getRoleIcon()}</span>
                Dashboard
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-orange-400 dark:hover:text-blue-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdown(prev => !prev)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="relative">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={getUserDisplayName()}
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] flex items-center justify-center">
                        <FaUserCircle className="text-white text-lg" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {getRoleIcon()}
                    </div>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {getUserRoleLabel()}
                      {isFraud && ' (Restricted)'}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      profileDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
                    <div className="p-2">
                      {getDashboardRoutes().map(route => (
                        <button
                          key={route.path}
                          onClick={() => {
                            setProfileDropdown(false);
                            navigate(route.path);
                          }}
                          className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group text-left"
                        >
                          <span className="mr-3 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            {route.icon}
                          </span>
                          {route.label}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FaSignOutAlt className="mr-3" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-blue-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile toggles */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-black-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(link => {
              if (link.private && !user) return null;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-white-600 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </NavLink>
              );
            })}

            {user && (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleDashboardClick();
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] dark:from-blue-900/30 dark:to-purple-900/30 text-white-600 dark:text-white-300 mt-1"
                >
                  <span className="mr-3">{getRoleIcon()}</span>
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Inline Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.18s ease-out; }
        .animate-slideDown { animation: slideDown 0.25s ease-out; }
      `}</style>
    </nav>
  );
};

export default Navbar;
