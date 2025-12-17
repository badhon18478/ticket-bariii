import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Briefcase,
  ArrowUpDown,
  Grid3x3,
  List,
  Search,
  Filter,
} from 'lucide-react';
import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import useAxiosSecure from '../hooks/useAxiosSecure';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const axiosSecure = useAxiosSecure();
  const categories = [
    'All',
    'Web Development',
    'Digital Marketing',
    'Graphics Designing',
    'Content Writing',
    'Video Editing',
  ];

  useEffect(() => {
    fetchJobs();
  }, [sortOrder, axiosSecure]);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, selectedCategory, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/api/jobs?sort=${sortOrder}`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchQuery) {
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.postedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <title>All Jobs</title>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary  via-blue-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Discover Opportunities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Browse through our curated list of freelance jobs and find the
            perfect match for your skills
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, description, or poster..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none cursor-pointer transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleSort}
              className="flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span className="hidden sm:inline">
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Showing{' '}
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {filteredJobs.length}
            </span>{' '}
            {filteredJobs.length === 1 ? 'job' : 'jobs'}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </motion.p>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-md">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Jobs Grid/List */}
        <AnimatePresence mode="wait">
          {filteredJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Briefcase className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Check back later for new opportunities'}
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="jobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredJobs.map((job, index) => (
                <JobCard key={job._id} job={job} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button (if you implement pagination later) */}
        {filteredJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Showing all {filteredJobs.length}{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllJobs;
