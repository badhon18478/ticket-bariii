// src/routes/router.js
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register/Register';
import AllTickets from '../pages/AllTickets';
import TicketDetails from '../pages/TicketDetails';

// Dashboard Layouts
import UserDashboardLayout from '../layouts/dashboard/UserDashboardLayout';
import VendorDashboardLayout from '../layouts/dashboard/VendorDashboardLayout';
import AdminDashboardLayout from '../layouts/dashboard/AdminDashboardLayout';

// Dashboard Pages
import UserProfile from '../pages/dashboard/user/UserProfile';
import MyBookedTickets from '../pages/dashboard/user/MyBookedTickets';
import TransactionHistory from '../pages/dashboard/user/TransactionHistory';

import VendorProfile from '../pages/dashboard/vendor/VendorProfile';
import AddTicket from '../pages/dashboard/vendor/AddTicket';
import MyAddedTickets from '../pages/dashboard/vendor/MyAddedTickets';
import RequestedBookings from '../pages/dashboard/vendor/RequestedBookings';
import RevenueOverview from '../pages/dashboard/vendor/RevenueOverview';

import AdminProfile from '../pages/dashboard/admin/AdminProfile';
import ManageTickets from '../pages/dashboard/admin/ManageTickets';
import ManageUsers from '../pages/dashboard/admin/ManageUsers';
import AdvertiseTickets from '../pages/dashboard/admin/AdvertiseTickets';

// Auth
import PrivateRoute from '../contexts/PrivateRoute';
import RoleBasedRoute from '../contexts/RoleBasedRoute';
import NotFound from '../pages/Error';

export const router = createBrowserRouter([
  // ================= MAIN =================
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'all-tickets',
        element: (
          <PrivateRoute>
            <AllTickets />
          </PrivateRoute>
        ),
      },
      {
        path: 'tickets/:id',
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <NotFound /> },
    ],
  },

  // ================= USER DASHBOARD =================
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <RoleBasedRoute allowedRoles={['user']}>
          <UserDashboardLayout />
        </RoleBasedRoute>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'bookings', element: <MyBookedTickets /> },
      { path: 'transactions', element: <TransactionHistory /> },
    ],
  },

  // ================= VENDOR DASHBOARD =================
  {
    path: '/vendor-dashboard',
    element: (
      <PrivateRoute>
        <RoleBasedRoute allowedRoles={['vendor']}>
          <VendorDashboardLayout />
        </RoleBasedRoute>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <VendorProfile /> },
      { path: 'add-ticket', element: <AddTicket /> },
      { path: 'my-tickets', element: <MyAddedTickets /> },
      { path: 'bookings', element: <RequestedBookings /> },
      { path: 'revenue', element: <RevenueOverview /> },
    ],
  },

  // ================= ADMIN DASHBOARD =================
  {
    path: '/admin-dashboard',
    element: (
      <PrivateRoute>
        <RoleBasedRoute allowedRoles={['admin']}>
          <AdminDashboardLayout />
        </RoleBasedRoute>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <AdminProfile /> },
      { path: 'manage-tickets', element: <ManageTickets /> },
      { path: 'manage-users', element: <ManageUsers /> },
      { path: 'advertise-tickets', element: <AdvertiseTickets /> },
    ],
  },
]);
