import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaEdit,
  FaSave,
  FaTimes,
  FaChartLine,
  FaTicketAlt,
  FaUsers,
  FaMoneyBillWave,
} from 'react-icons/fa';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthProvider';
// import { AuthContext } from '../../../AuthContext';

const VendorProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingTickets: 0,
  });
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    taxId: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      fetchVendorProfile();
      fetchVendorStats();
    }
  }, [user]);

  const fetchVendorProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/vendors/profile`
      );
      setFormData(response.data.vendor);
    } catch (error) {
      console.error('Fetch vendor profile error:', error);
    }
  };

  const fetchVendorStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/vendors/stats`
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error('Fetch vendor stats error:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/vendors/profile`,
        formData
      );

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update vendor profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Vendor Profile</h1>
            <p className="text-blue-100">
              Manage your vendor account and view business insights
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 md:mt-0 px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isEditing ? (
              <>
                <FaTimes className="inline mr-2" />
                Cancel Editing
              </>
            ) : (
              <>
                <FaEdit className="inline mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <FaTicketAlt className="text-blue-600 dark:text-blue-300 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Tickets
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalTickets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
              <FaUsers className="text-green-600 dark:text-green-300 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Bookings
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.totalBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
              <FaMoneyBillWave className="text-purple-600 dark:text-purple-300 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
              <FaChartLine className="text-yellow-600 dark:text-yellow-300 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending Tickets
              </h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pendingTickets}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Business Information
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                >
                  <option value="">Select Type</option>
                  <option value="bus">Bus Service</option>
                  <option value="train">Train Service</option>
                  <option value="launch">Launch Service</option>
                  <option value="airline">Airline</option>
                  <option value="travel_agency">Travel Agency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax ID / Business Registration
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Tell us about your business..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <FaSave className="inline mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FaBuilding className="text-blue-600 dark:text-blue-400 text-xl mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Company Name
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.companyName || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FaUser className="text-blue-600 dark:text-blue-400 text-xl mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Contact Person
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.contactPerson || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.email || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FaPhone className="text-blue-600 dark:text-blue-400 text-xl mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Business Type
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.businessType || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Tax ID
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.taxId || 'Not provided'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Website
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.website ? (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {formData.website}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
              <div className="flex items-start mb-4">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-xl mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Business Address
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.address || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {formData.description && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Business Description
                </h4>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {formData.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;
