import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCog,
  FaChartBar,
  FaUsers,
  FaTicketAlt,
  FaMoneyBillWave,
  FaEdit,
  FaCamera,
  FaCheckCircle,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaBell,
  FaHistory,
  FaKey,
  FaDatabase,
} from 'react-icons/fa';
// import { useAuth } from '../../../context/AuthContext';
// import api from '../../../utils/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';
// import { AuthContext } from '../../../AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useAuth } from '../../../contexts/AuthProvider';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    photoURL: '',
  });
  const [uploading, setUploading] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    fetchAdminData();
    fetchSystemInfo();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/users/admin/profile');
      setAdminData(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || '',
        department: response.data.department || 'Platform Management',
        role: response.data.role || 'Super Admin',
        photoURL: response.data.photoURL,
      });
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemInfo = async () => {
    try {
      const response = await axiosSecure.get('/admin/system-info');
      setSystemInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch system info');
    }
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG and PNG images are allowed');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosSecure.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
        ...prev,
        photoURL: response.data.url,
      }));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axiosSecure.put('/users/admin/profile', formData);
      updateProfile(response.data.user);
      setAdminData(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const adminStats = [
    {
      label: 'Platform Users',
      value: adminData?.totalUsers || 0,
      icon: <FaUsers className="text-purple-500" />,
      color: 'from-purple-500 to-pink-600',
    },
    {
      label: 'Active Tickets',
      value: adminData?.activeTickets || 0,
      icon: <FaTicketAlt className="text-blue-500" />,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Platform Revenue',
      value: `$${adminData?.platformRevenue || 0}`,
      icon: <FaMoneyBillWave className="text-green-500" />,
      color: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Admin Actions',
      value: adminData?.adminActions || 0,
      icon: <FaChartBar className="text-red-500" />,
      color: 'from-red-500 to-orange-600',
    },
  ];

  const permissions = [
    {
      name: 'User Management',
      level: 'Full Access',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    {
      name: 'Ticket Moderation',
      level: 'Full Access',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      name: 'System Settings',
      level: 'Full Access',
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
    {
      name: 'Analytics Dashboard',
      level: 'Full Access',
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
    {
      name: 'Payment Management',
      level: 'Full Access',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      name: 'Content Management',
      level: 'Full Access',
      color:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
  ];

  const recentAdminActions = [
    {
      id: 1,
      action: 'Approved vendor registration',
      user: 'Travel Express Co.',
      time: '10 min ago',
    },
    {
      id: 2,
      action: 'Updated system settings',
      user: 'System',
      time: '1 hour ago',
    },
    {
      id: 3,
      action: 'Resolved user complaint',
      user: 'John Doe',
      time: '3 hours ago',
    },
    {
      id: 4,
      action: 'Generated monthly report',
      user: 'System',
      time: '5 hours ago',
    },
    {
      id: 5,
      action: 'Blocked fraudulent vendor',
      user: 'Quick Travel',
      time: '1 day ago',
    },
  ];

  const systemStats = [
    {
      label: 'Server Uptime',
      value: systemInfo?.uptime || '99.9%',
      icon: '🟢',
    },
    {
      label: 'Database Size',
      value: systemInfo?.dbSize || '2.4 GB',
      icon: '💾',
    },
    {
      label: 'Active Sessions',
      value: systemInfo?.activeSessions || 156,
      icon: '👥',
    },
    {
      label: 'API Requests',
      value: systemInfo?.apiRequests || '12.5k',
      icon: '🔌',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          {/* Admin Profile Picture */}
          <div className="relative group">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {formData.photoURL ? (
                  <img
                    src={formData.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold">
                    {user?.name?.charAt(0)}
                  </span>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                    <FaCamera />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <FaShieldAlt className="text-lg" />
                <span className="font-bold">Super Admin</span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                    <FaShieldAlt className="text-sm" />
                    <span className="text-sm">Platform Administrator</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <FaCog />
                    <span className="text-sm">System Manager</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <FaCheckCircle />
                    <span className="text-sm">Verified Admin</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 md:mt-0 px-6 py-2 bg-white text-purple-600 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
            <p className="text-purple-100 mb-4">
              Administrator since{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-sm opacity-90">Admin ID</p>
                <p className="font-bold">user?.email?.slice(0, 10) || ''</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-sm opacity-90">Department</p>
                <p className="font-bold">{formData.department}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-sm opacity-90">Access Level</p>
                <p className="font-bold text-purple-300">Level 10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-opacity-90">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Information Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Administrator Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">
                  Personal Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaUser className="text-gray-400" />
                    <span>Full Name</span>
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400" />
                    <span>Email Address</span>
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {user.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaPhone className="text-gray-400" />
                    <span>Phone Number</span>
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {adminData?.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Admin Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">
                  Administrator Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaUser className="text-gray-400" />
                    <span>Admin Role</span>
                  </span>
                </label>
                {isEditing ? (
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Content Admin">Content Admin</option>
                    <option value="Support Admin">Support Admin</option>
                    <option value="Financial Admin">Financial Admin</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {formData.role}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>Department</span>
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {formData.department}
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">
                  Account Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>Admin Since</span>
                  </span>
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaShieldAlt className="text-gray-400" />
                    <span>Account Status</span>
                  </span>
                </label>
                <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl flex items-center space-x-2">
                  <FaCheckCircle />
                  <span>Active Administrator</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Admin Profile
                </button>
              </div>
            )}
          </form>
        </motion.div>

        {/* Permissions & System Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Admin Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Administrator Permissions</h2>
              <FaLock className="text-purple-500" />
            </div>

            <div className="space-y-3">
              {permissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <span className="font-medium">{permission.name}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${permission.color}`}
                  >
                    {permission.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Information */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">System Information</h3>
              <FaDatabase className="text-blue-400" />
            </div>

            <div className="space-y-4">
              {systemStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <span className="font-bold">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-bold mb-3">Quick System Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm">
                  <span className="font-medium">Clear System Cache</span>
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm">
                  <span className="font-medium">Backup Database</span>
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm">
                  <span className="font-medium">View System Logs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Admin Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Actions</h2>
              <FaHistory className="text-purple-500" />
            </div>

            <div className="space-y-4">
              {recentAdminActions.map(action => (
                <div
                  key={action.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <p className="font-medium">{action.action}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {action.user}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {action.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Security Settings</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="font-medium flex items-center space-x-2">
                  <FaKey />
                  <span>Change Password</span>
                </span>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="font-medium flex items-center space-x-2">
                  <FaBell />
                  <span>Notification Settings</span>
                </span>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="font-medium flex items-center space-x-2">
                  <FaShieldAlt />
                  <span>Two-Factor Authentication</span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Health Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">System Health Dashboard</h2>
            <p className="text-purple-200">Real-time platform monitoring</p>
          </div>
          <FaChartBar className="text-3xl text-green-400" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400">99.9%</div>
            <p className="text-sm text-purple-200 mt-2">Platform Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400">1.2s</div>
            <p className="text-sm text-purple-200 mt-2">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400">98%</div>
            <p className="text-sm text-purple-200 mt-2">User Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-400">0</div>
            <p className="text-sm text-purple-200 mt-2">Critical Issues</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <div className="font-bold mb-1">Generate Report</div>
            <p className="text-sm text-purple-200">
              Create system performance report
            </p>
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <div className="font-bold mb-1">Audit Logs</div>
            <p className="text-sm text-purple-200">
              View detailed system audit logs
            </p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
