// src/contexts/RoleBasedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, userRole, userData, loading } = useAuth();

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log('❌ [RoleBasedRoute] No user, redirecting to login');
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  // Get the actual role
  const actualRole = userRole || userData?.role || 'user';

  console.log('🔍 [RoleBasedRoute] Checking access:', {
    user: user.email,
    actualRole,
    allowedRoles,
    path: window.location.pathname,
  });

  // Check if user's role is allowed
  if (!allowedRoles.includes(actualRole)) {
    console.log('🚫 [RoleBasedRoute] Access denied for role:', actualRole);

    // Redirect to appropriate dashboard
    if (actualRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (actualRole === 'vendor') {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('✅ [RoleBasedRoute] Access granted for role:', actualRole);
  return children;
};

export default RoleBasedRoute;
