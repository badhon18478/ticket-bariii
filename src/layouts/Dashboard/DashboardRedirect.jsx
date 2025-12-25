// src/components/DashboardRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
// import { useAuth } from '../contexts/AuthProvider';

const DashboardRedirect = () => {
  const { user, userRole, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!user) {
      // If no user, redirect to login
      navigate('/login', { replace: true });
      return;
    }

    // Get the actual role
    const role = userRole || userData?.role || 'user';
    console.log(
      '🔄 [DashboardRedirect] Redirecting user:',
      user.email,
      'Role:',
      role
    );

    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin-dashboard', { replace: true });
    } else if (role === 'vendor') {
      navigate('/vendor-dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userRole, userData, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
