import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaSearch,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUsers,
  FaRoute,
  FaPercentage,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import useAxiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketCard from '../components/tickets/TicketCard';
import { useTheme } from '../hooks/useTheme';
// import { useTheme } from '../contexts/ThemeContext';
// import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
  });
  const { theme } = useTheme();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const [advertised, latest] = await Promise.all([
        axiosSecure.get('/api/tickets/advertised'),
        axiosSecure.get('/api/tickets/latest?limit=8'),
      ]);

      setAdvertisedTickets(advertised.data);
      setLatestTickets(latest.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchData.from && searchData.to) {
      navigate(`/all-tickets?from=${searchData.from}&to=${searchData.to}`);
    }
  };

  const getTransportIcon = type => {
    const icons = {
      bus: <FaBus className="text-lg" />,
      train: <FaTrain className="text-lg" />,
      launch: <FaShip className="text-lg" />,
      plane: <FaPlane className="text-lg" />,
    };
    return icons[type?.toLowerCase()] || <FaBus className="text-lg" />;
  };

  const popularRoutes = [
    {
      from: 'Dhaka',
      to: 'Chittagong',
      price: 25,
      transport: 'bus',
      duration: '6h',
    },
    {
      from: 'Dhaka',
      to: 'Sylhet',
      price: 30,
      transport: 'train',
      duration: '7h',
    },
    {
      from: 'Dhaka',
      to: "Cox's Bazar",
      price: 35,
      transport: 'bus',
      duration: '10h',
    },
    {
      from: 'Chittagong',
      to: 'Sylhet',
      price: 28,
      transport: 'bus',
      duration: '8h',
    },
  ];

  const stats = [
    {
      number: '50K+',
      label: 'Happy Travelers',
      icon: <FaUsers className="text-3xl" />,
    },
    {
      number: '1000+',
      label: 'Routes Available',
      icon: <FaRoute className="text-3xl" />,
    },
    {
      number: '24/7',
      label: 'Customer Support',
      icon: <FaHeadset className="text-3xl" />,
    },
    {
      number: '99%',
      label: 'Satisfaction Rate',
      icon: <FaPercentage className="text-3xl" />,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* ========== Hero Section ========== */}
      <section
        className={`relative overflow-hidden py-20 px-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900'
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Trust Badge */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <FaStar className="text-yellow-400 animate-pulse" />
              <span className="font-semibold text-white">
                Trusted by 93,250+ travelers
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight text-white">
              Book Your Next
            </h1>
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-gradient">
                Adventure Today
              </h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover and book bus, train, launch & flight tickets easily.
              Seamless travel experience at your fingertips.
            </p>
          </div>

          {/* Search Box - Image.png style অনুযায়ী */}
          <div className="max-w-4xl mx-auto mb-16 animate-slide-up delay-200">
            <form
              onSubmit={handleSearch}
              className="bg-white/10 backdrop-blur-lg p-4 md:p-6 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* From Location */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500 text-xl" />
                    <span className="text-gray-500 text-lg">📍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="From Location"
                    value={searchData.from}
                    onChange={e =>
                      setSearchData({ ...searchData, from: e.target.value })
                    }
                    className="w-full pl-14 pr-4 py-4 bg-white rounded-xl border-2 border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 placeholder-gray-500"
                  />
                  <div className="absolute -bottom-6 left-0 text-sm text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    51 locations available
                  </div>
                </div>

                {/* To Location */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500 text-xl" />
                    <span className="text-gray-500 text-lg">📍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="To Location"
                    value={searchData.to}
                    onChange={e =>
                      setSearchData({ ...searchData, to: e.target.value })
                    }
                    className="w-full pl-14 pr-4 py-4 bg-white rounded-xl border-2 border-transparent focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 text-gray-800 placeholder-gray-500"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-3">
                    <FaSearch className="text-xl group-hover:rotate-12 transition-transform" />
                    <span className="text-lg">Search Tickets</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              </div>
            </form>
          </div>

          {/* Stats Section - Image.png অনুযায়ী */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-slide-up delay-300">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="inline-block p-4 rounded-full bg-gradient-to-br from-white/10 to-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-3xl md:text-4xl font-extrabold mb-2 text-white group-hover:text-orange-300 transition-colors">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Advertisement Section ========== */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 rounded-full text-sm font-bold mb-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              🎯 Featured Deals
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Advertisement Section
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Have a place to chat by our team for the best travel experience!
            </p>
            {/* Navigation Buttons - Image.png style */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <FaArrowRight className="rotate-180" />
              </button>
              <button className="p-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                <FaArrowRight />
              </button>
            </div>
          </div>

          {advertisedTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advertisedTickets.slice(0, 6).map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <FaTicketAlt className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No featured tickets available at the moment
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== Latest Tickets Section ========== */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Tickets
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Recently added travel options for your next journey
            </p>
          </div>

          {latestTickets.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation
              className="pb-12"
            >
              {latestTickets.map(ticket => (
                <SwiperSlide key={ticket._id}>
                  <TicketCard ticket={ticket} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No tickets available at the moment
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ========== Popular Routes Section ========== */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Routes
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Most traveled destinations this season
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {getTransportIcon(route.transport)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {route.from} → {route.to}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {route.duration}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${route.price}
                  </span>
                  <Link
                    to={`/all-tickets?from=${route.from}&to=${route.to}`}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    View Tickets
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Why Choose Us Section ========== */}
      <section
        className={`py-16 px-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50'
            : 'bg-gradient-to-br from-blue-600 to-indigo-700'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose TicketBari?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Your trusted travel partner for seamless booking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Fast Booking',
                description:
                  'Book tickets in under 60 seconds with our streamlined process',
              },
              {
                icon: '🛡️',
                title: 'Secure Payment',
                description:
                  'Bank-level security with encrypted payment processing',
              },
              {
                icon: '⭐',
                title: 'Best Prices',
                description:
                  'Guaranteed lowest prices with price match promise',
              },
              {
                icon: '📱',
                title: 'Mobile App',
                description:
                  'Book on the go with our user-friendly mobile application',
              },
              {
                icon: '🎫',
                title: 'Easy Refunds',
                description: 'Quick and hassle-free refund process',
              },
              {
                icon: '👥',
                title: '24/7 Support',
                description: 'Round-the-clock customer support team',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl p-8 md:p-12 border border-orange-200 dark:border-orange-800">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust TicketBari for
              their journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/all-tickets"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Browse All Tickets
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
