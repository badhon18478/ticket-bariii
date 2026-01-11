import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/Dashboard/DashboardLayout';
import PrivateRoute from '../contexts/PrivateRoute';
import RoleBasedRoute from './RoleBaseRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register/Register';
import AllTickets from '../pages/AllTickets';
import TicketDetails from '../pages/TicketDetails';
import ErrorPage from '../pages/Error';

// User Dashboard
import UserProfile from '../pages/dashboard/user/UserProfile';
import MyBookings from '../pages/dashboard/user/MyBookedTickets';
import TransactionHistory from '../pages/dashboard/user/TransactionHistory';

// Vendor Dashboard
import VendorProfile from '../pages/dashboard/vendor/VendorProfile';
import AddTicket from '../pages/dashboard/vendor/AddTicket';
import MyTickets from '../pages/dashboard/vendor/MyAddedTickets';
import RequestedBookings from '../pages/dashboard/vendor/RequestedBookings';
import RevenueOverview from '../pages/dashboard/vendor/RevenueOverview';

// Admin Dashboard
import AdminProfile from '../pages/dashboard/admin/AdminProfile';
import ManageTickets from '../pages/dashboard/admin/ManageTickets';
import ManageUsers from '../pages/dashboard/admin/ManageUsers';
import AdvertiseTickets from '../pages/dashboard/admin/AdvertiseTickets';
import BookingPage from '../pages/Dashboard/user/BookingPage';
import PaymentSuccess from '../components/tickets/PaymentSuccess ';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/all-tickets',
        element: (
          <PrivateRoute>
            <AllTickets />
          </PrivateRoute>
        ),
      },
      {
        path: '/book-ticket/:id',
        element: (
          <PrivateRoute>
            <BookingPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/ticket/:id',
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // User Routes
      {
        path: 'payment-success', // ✅
        Component: PaymentSuccess,
      },
      {
        path: 'user-profile',
        element: (
          <RoleBasedRoute allowedRoles={['user', 'vendor', 'admin']}>
            <UserProfile />
          </RoleBasedRoute>
        ),
      },
      // Update your router.js file

      // In the dashboard children array, add this route:

      {
        path: 'my-bookings',
        element: (
          <RoleBasedRoute allowedRoles={['user']}>
            <MyBookings />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'transaction-history',
        element: (
          <RoleBasedRoute allowedRoles={['user']}>
            <TransactionHistory />
          </RoleBasedRoute>
        ),
      },

      // Vendor Routes
      {
        path: 'vendor-profile',
        element: (
          <RoleBasedRoute allowedRoles={['vendor']}>
            <VendorProfile />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'add-ticket',
        element: (
          <RoleBasedRoute allowedRoles={['vendor']}>
            <AddTicket />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'my-tickets',
        element: (
          <RoleBasedRoute allowedRoles={['vendor']}>
            <MyTickets />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'requested-bookings',
        element: (
          <RoleBasedRoute allowedRoles={['vendor']}>
            <RequestedBookings />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'revenue-overview',
        element: (
          <RoleBasedRoute allowedRoles={['vendor']}>
            <RevenueOverview />
          </RoleBasedRoute>
        ),
      },

      // Admin Routes
      {
        path: 'admin-profile',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminProfile />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'manage-tickets',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <ManageTickets />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'advertise-tickets',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdvertiseTickets />
          </RoleBasedRoute>
        ),
      },
    ],
  },
]);

export default router;
