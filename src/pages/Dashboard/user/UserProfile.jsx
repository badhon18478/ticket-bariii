import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
  FaCheckCircle,
  FaTicketAlt,
  FaHistory,
  FaShieldAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBell,
} from 'react-icons/fa';
// import { useAuth } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthProvider';
// import { AuthContext } from '../../../AuthContext';

const UserProfile = () => {
  const { user, updateProfile } = useAuth() || {};

  // Defensive: if user isn't available yet, show loading to avoid runtime errors
  useEffect(() => {
    if (!user) {
      setLoading(true);
    }
  }, [user]);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photoURL: '',
  });
  const [uploading, setUploading] = useState(false);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/users/profile');
      setProfileData(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || '',
        address: response.data.address || '',
        photoURL: response.data.photoURL,
      });
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
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
      const response = await axiosSecure.put('/users/profile', formData);
      updateProfile(response.data.user);
      setProfileData(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const stats = [
    {
      label: 'Total Bookings',
      value: profileData?.totalBookings || 0,
      icon: <FaTicketAlt className="text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Successful Trips',
      value: profileData?.successfulTrips || 0,
      icon: <FaCheckCircle className="text-green-500" />,
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Pending Payments',
      value: profileData?.pendingPayments || 0,
      icon: <FaCreditCard className="text-yellow-500" />,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'Account Age',
      value: profileData?.accountAge || 'New',
      icon: <FaHistory className="text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Booked ticket to Cox's Bazar",
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      action: 'Updated profile information',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      action: 'Payment for Dhaka to Sylhet',
      time: '3 days ago',
      status: 'completed',
    },
    {
      id: 4,
      action: 'Ticket download requested',
      time: '1 week ago',
      status: 'completed',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="relative">
              <img
                src={formData?.photoURL || user?.photoURL}
                alt={user?.name}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
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
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <span className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                    <FaUser className="text-sm" />
                    <span className="text-sm">Regular User</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <FaCheckCircle />
                    <span className="text-sm">Verified</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 md:mt-0 px-6 py-2 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
            <p className="text-blue-100 mb-4">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${stat.color} p-6 rounded-2xl shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
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
                    value={formData?.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {user.name}
                  </div>
                )}
              </div>

              {/* Email */}
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
                    value={formData?.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {user.email}
                  </div>
                )}
              </div>

              {/* Phone */}
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
                    value={formData?.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {profileData?.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>Address</span>
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {profileData?.address || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>Member Since</span>
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

              {/* Account Status */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaShieldAlt className="text-gray-400" />
                    <span>Account Status</span>
                  </span>
                </label>
                <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl flex items-center space-x-2">
                  <FaCheckCircle />
                  <span>Active</span>
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activities</h2>
            <FaBell className="text-blue-500" />
          </div>

          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Account Security */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Account Security</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="font-medium">Change Password</span>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="font-medium">Two-Factor Authentication</span>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="font-medium">Login History</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
