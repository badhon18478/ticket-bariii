// src/components/Navbar.jsx - UPDATED
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
  FaCog,
  FaBell,
  FaHistory,
  FaChartBar,
  FaPlusCircle,
  FaUsers,
  FaSun,
  FaMoon,
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

  // -------- Role helpers --------
  const resolvedRole = userRole || userData?.role || user?.role || 'user';
  const isFraud = userData?.isFraud || false;

  const getRoleIcon = () => {
    if (!resolvedRole) return null;
    if (resolvedRole === 'admin')
      return <FaShieldAlt className="w-4 h-4 text-purple-500" />;
    if (resolvedRole === 'vendor')
      return <FaStore className="w-4 h-4 text-green-500" />;
    return <FaUser className="w-4 h-4 text-blue-500" />;
  };

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
    if (!user) return '/login';

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
    if (!user) return 'User';
    return (
      user.displayName?.split(' ')[0] ||
      userData?.name?.split(' ')[0] ||
      user.email?.split('@')[0] ||
      'User'
    );
  };

  const getUserRoleLabel = () => {
    if (!resolvedRole) return '';
    return resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1);
  };

  // -------- Handlers --------
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

  const handleDashboardClick = () => {
    navigate(getDashboardRoot());
    setProfileDropdown(false);
  };

  // scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // click outside dropdown
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
              <div
                className="w-11 h-11 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] rounded-xl flex items-center justify-center shadow-lg
                group-hover:scale-105 transition-transform"
              >
                <FaBus className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B]">
                  Ticket
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B]">
                    Bari
                  </span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                  Book bus, train, launch & flight tickets easily
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              if (link.private && !user) return null;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? ' bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white-600 white:text-white-300'
                        : 'text-white-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white-600 dark:hover:text-blue-300'
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

            {/* Dashboard link for logged in users */}
            {user && (
              <button
                onClick={handleDashboardClick}
                className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all ml-2"
              >
                <span className="mr-2">{getRoleIcon()}</span>
                Dashboard
              </button>
            )}
          </div>

          {/* Right side desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-orange-400 dark:hover:text-blue-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <>
                {/* profile dropdown */}
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
                      {/* header */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={getUserDisplayName()}
                              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <FaUserCircle className="text-white text-xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.email || 'No email'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 capitalize">
                                {getUserRoleLabel()}
                              </span>
                              {isFraud && (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300">
                                  Restricted
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* dashboard links */}
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Dashboard
                        </div>
                        {getDashboardRoutes().map(route => (
                          <button
                            key={route.path}
                            onClick={() => {
                              setProfileDropdown(false);
                              navigate(route.path);
                            }}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group text-left"
                          >
                            <span className="mr-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                              {route.icon}
                            </span>
                            {route.label}
                          </button>
                        ))}
                      </div>

                      {/* logout */}
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FaSignOutAlt className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* mobile toggles */}
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
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

      {/* mobile menu */}
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
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-300'
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
                  className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-300 mt-1"
                >
                  <span className="mr-3">{getRoleIcon()}</span>
                  Dashboard
                </button>

                {/* Quick dashboard links */}
                <div className="pl-4">
                  {getDashboardRoutes()
                    .slice(0, 3)
                    .map(route => (
                      <button
                        key={route.path}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(route.path);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <span className="mr-2">{route.icon}</span>
                        {route.label}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* mobile auth */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={getUserDisplayName()}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FaUserCircle className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                      {getUserRoleLabel()}
                      {isFraud && ' (Restricted)'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}

      {/* inline animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.18s ease-out; }
        .animate-slideDown { animation: slideDown 0.25s ease-out; }
      `}</style>
    </nav>
  );
};

export default Navbar;
