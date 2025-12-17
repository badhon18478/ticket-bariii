// ============================================
// FILE: src/pages/NotFound.jsx
// ============================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <title>Page Not Found</title>
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.h1
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
            >
              404
            </motion.h1>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Search className="w-32 h-32 text-primary/30 mx-auto" />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              The page you're looking for seems to have wandered off into the
              digital wilderness. Don't worry, we'll help you find your way
              back!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary to-blue-600 rounded-xl hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-primary bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg border-2 border-primary/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-white rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Browse Jobs', path: '/allJobs' },
                { name: 'Post a Job', path: '/add-job' },
                { name: 'My Tasks', path: '/my-accepted-tasks' },
                { name: 'Help Center', path: '#' },
              ].map((link, index) => (
                <motion.button
                  key={index}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(link.path)}
                  className="p-3 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-blue-600/10 hover:text-primary transition-all border border-gray-200"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
