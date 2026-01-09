import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthProvider';
import {
  FiHome,
  FiUser,
  FiShoppingBag,
  FiDollarSign,
  FiPlusCircle,
  FiPackage,
  FiList,
  FiPieChart,
  FiSettings,
  FiUsers,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthProvider';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // User routes
  const userRoutes = [
    {
      path: '/dashboard/user-profile',
      name: 'User Profile',
      icon: <FiUser />,
    },
    {
      path: '/dashboard/my-bookings',
      name: 'My Booked Tickets',
      icon: <FiShoppingBag />,
    },
    {
      path: '/dashboard/transaction-history',
      name: 'Transaction History',
      icon: <FiDollarSign />,
    },
  ];

  // Vendor routes
  const vendorRoutes = [
    {
      path: '/dashboard/vendor-profile',
      name: 'Vendor Profile',
      icon: <FiUser />,
    },
    {
      path: '/dashboard/add-ticket',
      name: 'Add Ticket',
      icon: <FiPlusCircle />,
    },
    {
      path: '/dashboard/my-tickets',
      name: 'My Added Tickets',
      icon: <FiPackage />,
    },
    {
      path: '/dashboard/requested-bookings',
      name: 'Requested Bookings',
      icon: <FiList />,
    },
    {
      path: '/dashboard/revenue-overview',
      name: 'Revenue Overview',
      icon: <FiPieChart />,
    },
  ];

  // Admin routes
  const adminRoutes = [
    {
      path: '/dashboard/admin-profile',
      name: 'Admin Profile',
      icon: <FiUser />,
    },
    {
      path: '/dashboard/manage-tickets',
      name: 'Manage Tickets',
      icon: <FiSettings />,
    },
    {
      path: '/dashboard/manage-users',
      name: 'Manage Users',
      icon: <FiUsers />,
    },
    {
      path: '/dashboard/advertise-tickets',
      name: 'Advertise Tickets',
      icon: <FiStar />,
    },
  ];

  // Get routes based on role
  const getRoutes = () => {
    switch (userRole) {
      case 'admin':
        return adminRoutes;
      case 'vendor':
        return vendorRoutes;
      default:
        return userRoutes;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <FaBus className="text-primary text-2xl" />
            <span className="ml-2 text-xl font-bold text-primary">
              TicketBari
            </span>
          </div>
          <div className="flex items-center px-4 mt-6">
            <img
              className="w-10 h-10 rounded-full"
              src={user?.photoURL || 'https://via.placeholder.com/40'}
              alt={user?.name}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          <nav className="flex-1 mt-5 space-y-1">
            {getRoutes().map(route => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{route.icon}</span>
                {route.name}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-full max-w-xs bg-white">
            <div className="flex items-center justify-between px-4 pt-5 pb-4">
              <div className="flex items-center">
                <FaBus className="text-primary text-2xl" />
                <span className="ml-2 text-xl font-bold text-primary">
                  TicketBari
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <FiX className="text-gray-500 text-xl" />
              </button>
            </div>
            <div className="flex items-center px-4">
              <img
                className="w-10 h-10 rounded-full"
                src={user?.photoURL || 'https://via.placeholder.com/40'}
                alt={user?.name}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <nav className="flex-1 px-2 mt-5 space-y-1">
              {getRoutes().map(route => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3">{route.icon}</span>
                  {route.name}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex items-center h-16 bg-white border-b lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500"
          >
            <FiMenu className="text-2xl" />
          </button>
          <div className="flex items-center justify-center flex-1">
            <FaBus className="text-primary text-xl" />
            <span className="ml-2 text-lg font-bold text-primary">
              Dashboard
            </span>
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
