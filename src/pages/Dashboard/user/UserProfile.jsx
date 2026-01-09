// import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiUser, FiShield } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthProvider';

const UserProfile = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        User Profile
      </h2>

      <div className="card">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <img
            src={user?.photoURL || 'https://via.placeholder.com/150'}
            alt={user?.displayName}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {user?.displayName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {user?.email}
            </p>
            <span className="inline-block px-4 py-1 bg-primary text-white rounded-full text-sm capitalize">
              {userRole}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiUser className="text-primary text-xl" />
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Full Name
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8">
              {user?.displayName || 'Not provided'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiMail className="text-primary text-xl" />
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Email Address
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8">
              {user?.email}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiShield className="text-primary text-xl" />
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Role
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-8 capitalize">
              {userRole}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiUser className="text-primary text-xl" />
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Account Status
              </h4>
            </div>
            <p className="text-green-600 dark:text-green-400 ml-8">Active</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            Account Information
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your account is verified and active. You can book tickets, view your
            bookings, and manage your profile from this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
