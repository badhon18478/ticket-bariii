// src/contexts/RoleBasedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user) return null;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
