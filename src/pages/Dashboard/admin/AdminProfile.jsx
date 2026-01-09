// import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiUser, FiShield } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthProvider';

const AdminProfile = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Admin Profile
      </h2>

      <div className="card">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <img
            src={user?.photoURL || 'https://via.placeholder.com/150'}
            alt={user?.displayName}
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
          />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {user?.displayName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {user?.email}
            </p>
            <span className="inline-block px-4 py-1 bg-purple-500 text-white rounded-full text-sm capitalize">
              {userRole}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FiUser className="text-purple-500 text-xl" />
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
              <FiMail className="text-purple-500 text-xl" />
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
              <FiShield className="text-purple-500 text-xl" />
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
              <FiUser className="text-purple-500 text-xl" />
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Access Level
              </h4>
            </div>
            <p className="text-green-600 dark:text-green-400 ml-8">
              Full Access
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            Administrator Privileges
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            As an administrator, you have full control over the platform. You
            can manage users, approve or reject tickets, advertise tickets on
            the homepage, and monitor all activities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
