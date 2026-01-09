import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(userRole)) return <Navigate to="/" replace />;

  return children;
};

export default RoleBasedRoute;
