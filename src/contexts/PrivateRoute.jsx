// src/contexts/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log('🔒 [PrivateRoute] No user, redirecting to login');
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  console.log('✅ [PrivateRoute] User authenticated:', user.email);
  return children;
};

export default PrivateRoute;
