import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { AuthContext } from '../contexts/AuthContext';
// import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const MyAddedJobs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    if (user?.email) {
      fetchMyJobs();
    }
  }, [user, axiosSecure]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/api/jobs/user/${user.email}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async jobId => {
    if (
      window.confirm(
        'Are you sure you want to delete this job? This action cannot be undone.'
      )
    ) {
      try {
        setDeletingId(jobId);
        await axiosSecure.delete(`/api/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
        toast.success('Job deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = jobId => {
    navigate(`/updateJob/${jobId}`);
  };

  const handleViewDetails = jobId => {
    navigate(`/allJobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <title>My Posted Jobs</title>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            My Posted{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Jobs
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all the jobs you've posted on the platform
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-800">
                  {jobs.length}
                </p>
              </div>
              <Briefcase className="w-12 h-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-800">
                  {jobs.length}
                </p>
              </div>
              <Eye className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-800">
                  {
                    jobs.filter(job => {
                      const jobDate = new Date(job.postedDate);
                      const now = new Date();
                      return (
                        jobDate.getMonth() === now.getMonth() &&
                        jobDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
        </motion.div>

        {/* Jobs List */}
        <AnimatePresence mode="wait">
          {jobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20 bg-white rounded-2xl shadow-lg"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Briefcase className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No jobs posted yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by posting your first job to attract talented freelancers
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/add-job')}
                className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-blue-600 rounded-xl hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg"
              >
                Post Your First Job
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      <img
                        src={job.coverImage}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary">
                          {job.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2">
                            {job.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {new Date(job.postedDate).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4 text-primary" />
                          <span>{job.category}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetails(job._id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(job._id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(job._id)}
                          disabled={deletingId === job._id}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all border ${
                            deletingId === job._id
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200'
                          }`}
                        >
                          {deletingId === job._id ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                              />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default MyAddedJobs;
