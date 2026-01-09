// src/pages/dashboard/DashboardIndex.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

const DashboardIndex = () => {
  const { userRole, loading } = useAuth();

  if (loading) return null;

  if (userRole === 'admin') {
    return <Navigate to="/dashboard/admin-profile" replace />;
  }

  if (userRole === 'vendor') {
    return <Navigate to="/dashboard/vendor-profile" replace />;
  }

  return <Navigate to="/dashboard/profile" replace />;
};

export default DashboardIndex;
