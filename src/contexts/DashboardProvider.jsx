import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    activeTickets: 0,
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const markNotificationAsRead = id => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  };

  const addNotification = notification => {
    setNotifications(prev => [notification, ...prev]);
  };

  useEffect(() => {
    // Update unread count
    const unread = notifications.filter(n => n.unread).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulated API call
        const stats = {
          totalBookings: 45,
          totalRevenue: 2450,
          pendingRequests: 12,
          activeTickets: 8,
        };
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const value = {
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    toggleMobileMenu,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    addNotification,
    dashboardStats,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
