import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUsers, FiShield, FiAlertTriangle } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`
      );
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async userId => {
    if (!confirm('Are you sure you want to make this user an admin?')) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/role`,
        {
          role: 'admin',
        }
      );
      toast.success('User promoted to admin');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleMakeVendor = async userId => {
    if (!confirm('Are you sure you want to make this user a vendor?')) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/role`,
        {
          role: 'vendor',
        }
      );
      toast.success('User promoted to vendor');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleMarkFraud = async userId => {
    if (
      !confirm(
        'Are you sure you want to mark this vendor as fraud? This will hide all their tickets.'
      )
    )
      return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/fraud`
      );
      toast.success('Vendor marked as fraud');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to mark as fraud');
    }
  };

  const getRoleBadge = role => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      vendor: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || colors.user;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manage Users
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <FiUsers />
          <span>Total: {users.length} users</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-purple-50 dark:bg-purple-900">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Admins
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="card bg-blue-50 dark:bg-blue-900">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Vendors
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.role === 'vendor').length}
          </p>
        </div>
        <div className="card bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Users
          </h3>
          <p className="text-3xl font-bold text-gray-600">
            {users.filter(u => u.role === 'user').length}
          </p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Fraud Vendors
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {users.filter(u => u.isFraud).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.photoURL || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isFraud ? (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Fraud
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.role !== 'admin' && (
                    <div className="flex space-x-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                          title="Make Admin"
                        >
                          <FiShield size={14} />
                          <span>Admin</span>
                        </button>
                      )}
                      {user.role !== 'vendor' && !user.isFraud && (
                        <button
                          onClick={() => handleMakeVendor(user._id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="Make Vendor"
                        >
                          <FiUsers size={14} />
                          <span>Vendor</span>
                        </button>
                      )}
                      {user.role === 'vendor' && !user.isFraud && (
                        <button
                          onClick={() => handleMarkFraud(user._id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Mark as Fraud"
                        >
                          <FiAlertTriangle size={14} />
                          <span>Fraud</span>
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
