import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; // path adjust করো
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/api/users');
      const userData = Array.isArray(response.data) ? response.data : [];
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (newRole === 'admin') {
      if (!window.confirm('Make this user admin? They will get full access.'))
        return;
    }

    try {
      await axiosSecure.patch(`/api/users/${userId}/role`, { role: newRole });
      toast.success(`Role changed to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to change role');
    }
  };

  const handleMarkFraud = async userId => {
    if (
      !window.confirm(
        'Mark this vendor as fraud? All their tickets will be hidden.'
      )
    ) {
      return;
    }

    try {
      await axiosSecure.patch(`/api/users/${userId}/fraud`);
      toast.success('Vendor marked as fraud');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to mark as fraud');
    }
  };

  const handleUnmarkFraud = async userId => {
    if (
      !window.confirm(
        'Remove fraud status? Vendor tickets will be visible again.'
      )
    ) {
      return;
    }

    try {
      await axiosSecure.patch(`/api/users/${userId}/unfraud`);
      toast.success('Fraud status removed');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to remove fraud status');
    }
  };

  const getRoleBadgeColor = role => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'vendor':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">
            {filteredUsers.length} of {users.length} users
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-48"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map(user => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.photoURL || '/default-avatar.png'}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-gray-100"
                            onError={e => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                            user.role || 'user'
                          )}`}
                        >
                          {user.role?.toUpperCase() || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isFraud ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            🚫 FRAUD
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            ✅ Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, 'admin')
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 text-sm font-medium shadow-sm transition-all flex items-center gap-1"
                              disabled={user.role === 'admin'}
                            >
                              👑 Admin
                            </button>
                          )}
                          {user.role !== 'vendor' && (
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, 'vendor')
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium shadow-sm transition-all flex items-center gap-1"
                              disabled={user.role === 'vendor'}
                            >
                              🏪 Vendor
                            </button>
                          )}
                          {user.role === 'vendor' && (
                            <>
                              {!user.isFraud ? (
                                <button
                                  onClick={() => handleMarkFraud(user._id)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 text-sm font-medium shadow-sm transition-all flex items-center gap-1"
                                >
                                  🚫 Fraud
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUnmarkFraud(user._id)}
                                  className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 text-sm font-medium shadow-sm transition-all flex items-center gap-1"
                                >
                                  ✅ Restore
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                        currentPage === number
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or role filter
          </p>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
          >
            Reload Users
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
