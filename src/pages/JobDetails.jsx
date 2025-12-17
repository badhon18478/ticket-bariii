import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Calendar,
  User,
  Mail,
  CheckCircle,
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const JobDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    fetchJobDetails();
  }, [id, axiosSecure]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async () => {
    if (!user) {
      toast.error('Please login to accept jobs');
      navigate('/login');
      return;
    }

    if (job.userEmail === user.email) {
      toast.error('You cannot accept your own job posting');
      return;
    }

    try {
      setAccepting(true);

      const acceptedTask = {
        jobId: job._id,
        jobTitle: job.title,
        jobCategory: job.category,
        jobSummary: job.summary,
        coverImage: job.coverImage,
        jobPoster: job.userEmail,
        jobPosterName: job.postedBy,
        acceptedBy: user.email,
        acceptedByName: user.displayName || 'Anonymous',
      };

      await axiosSecure.post('/api/accepted-tasks', acceptedTask);

      toast.success('Job accepted successfully! 🎉');

      setTimeout(() => {
        navigate('/my-accepted-tasks');
      }, 1500);
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error('Failed to accept job. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: job.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getCategoryColor = category => {
    const colors = {
      'Web Development': 'from-blue-500 to-cyan-500',
      'Digital Marketing': 'from-purple-500 to-pink-500',
      'Graphics Designing': 'from-orange-500 to-red-500',
      'Content Writing': 'from-green-500 to-emerald-500',
      'Video Editing': 'from-yellow-500 to-amber-500',
      default: 'from-gray-500 to-slate-500',
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <title>Job Details</title>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 max-w-md mx-auto"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Job Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/alljobs')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Back to All Jobs
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwnJob = user?.email === job.userEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/alljobs')}
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to All Jobs</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={job.coverImage}
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-6 right-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold text-white backdrop-blur-md bg-gradient-to-r ${getCategoryColor(
                      job.category
                    )} shadow-2xl border-2 border-white/20`}
                  >
                    {job.category}
                  </motion.div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    {job.title}
                  </motion.h1>
                </div>
              </div>

              {/* Job Description */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Job Description
                  </h2>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {job.summary}
                </p>

                {/* Tags or Additional Info */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
                    Remote
                  </span>
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                    Freelance
                  </span>
                  <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
                    Flexible Hours
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                Job Information
              </h3>

              {/* Posted By */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Posted By
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {job.postedBy}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Contact
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white truncate">
                    {job.userEmail}
                  </p>
                </div>
              </div>

              {/* Posted Date */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Posted Date
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {new Date(job.postedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <AnimatePresence mode="wait">
                  {isOwnJob ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center"
                    >
                      <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                      <p className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
                        This is your own job posting
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        You cannot accept your own jobs
                      </p>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAcceptJob}
                      disabled={accepting}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                        accepting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      }`}
                    >
                      {accepting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Accept This Job
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share Job
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;
