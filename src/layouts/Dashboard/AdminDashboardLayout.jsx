import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaTicketAlt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaHome,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
} from 'react-icons/fa';
// import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthProvider';

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(8);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminRoutes = [
    { path: '/admin-dashboard/profile', label: 'Profile', icon: <FaUser /> },
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
    { path: '/admin-dashboard/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const clearNotifications = () => {
    setNotifications(0);
    toast.success('Notifications cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 dark:text-gray-300"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button onClick={clearNotifications} className="relative">
            <FaBell className="text-gray-600 dark:text-gray-300" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex pt-16 md:pt-0">
        {/* Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        `}
        >
          <div className="h-full flex flex-col">
            {/* Admin Info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Admin Account
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4">
                <NavLink
                  to="/"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaHome className="mr-3" />
                  Back to Home
                </NavLink>
              </div>

              <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Admin Dashboard
              </h3>
              <ul className="space-y-1">
                {adminRoutes.map(route => (
                  <li key={route.path}>
                    <NavLink
                      to={route.path}
                      end={route.path === '/admin/profile'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="mr-3">{route.icon}</span>
                      {route.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage platform settings and users
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={clearNotifications}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FaBell size={20} />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
