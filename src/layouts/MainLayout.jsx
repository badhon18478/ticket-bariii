// ========== Enhanced MainLayout.jsx ==========
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaRocket } from 'react-icons/fa';
import Navbar from '../components/Navber/Navbar';

const MainLayout = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const location = useLocation();

  // Page transition effect
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Initial app load
  useEffect(() => {
    const timer = setTimeout(() => setGlobalLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Page title management
  useEffect(() => {
    const titleMap = {
      '/': 'TicketBari - Book Smart, Travel Easy',
      '/all-tickets': 'All Tickets - Find Your Journey',
      '/login': 'Login - TicketBari',
      '/register': 'Register - Join TicketBari',
    };
    document.title =
      titleMap[location.pathname] || 'TicketBari - Premium Travel Booking';
  }, [location.pathname]);

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (globalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-ping" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-ping delay-1000" />
        </div>

        {/* Logo & Spinner */}
        <motion.div
          className="text-center relative z-10 space-y-8 px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="mx-auto w-24 h-24 mb-8 p-6 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex items-center justify-center"
          >
            <FaRocket className="w-16 h-16 text-white drop-shadow-lg" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
              TicketBari
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium tracking-wide">
              Loading your journey...
            </p>

            <div className="flex items-center justify-center space-x-4 text-white/70 text-sm">
              <FaSpinner className="animate-spin w-4 h-4" />
              <span>Fast • Secure • Reliable</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm supports-[backdrop-filter:blur(20px)]:bg-white/90">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-20rem)] pt-2 pb-20">
        <AnimatePresence mode="wait">
          {pageLoading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center min-h-[80vh] py-20"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Enhanced Spinner */}
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 0.5, repeat: Infinity },
                }}
              >
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full shadow-xl relative">
                  <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-ping opacity-75" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600 tracking-wide">
                    Loading...
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={location.pathname}
              className="transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl supports-[backdrop-filter:blur(20px)]:bg-white/90">
        <Footer />
      </footer>

      {/* Page Transition Overlay */}
      <AnimatePresence>
        {pageLoading && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-r from-purple-600/95 to-blue-600/95 z-50 flex items-center justify-center"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
