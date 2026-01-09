import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaSearch,
  FaStar,
  FaArrowRight,
  FaHeadset,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUsers,
  FaRoute,
  FaCalendarAlt,
  FaMobileAlt,
  FaMoneyBillWave,
  FaLock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSync,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import useAxiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';
// import TicketCard from '../components/tickets/TicketCard';
import { useTheme } from '../hooks/useTheme';
import TicketCard from '../components/TicketCard';

const Home = () => {
  const [searchData, setSearchData] = useState({ from: '', to: '', date: '' });
  const [transportType, setTransportType] = useState('all');

  const { theme } = useTheme();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch advertised tickets using React Query
  const {
    data: advertisedData,
    isLoading: loadingAdvertised,
    error: advertisedError,
    refetch: refetchAdvertised,
  } = useQuery({
    queryKey: ['advertisedTickets'],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get('/api/tickets/advertised');
        // console.log('Advertised API Response:');

        // Handle different response formats
        const tickets =
          response.data?.tickets ||
          response.data?.data?.tickets ||
          response.data?.data ||
          response.data ||
          [];

        return Array.isArray(tickets) ? tickets : [];
      } catch (error) {
        console.error('Error fetching advertised tickets:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch featured tickets'
        );
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  // Fetch latest tickets using React Query with transport filter
  const {
    data: latestData,
    isLoading: loadingLatest,
    error: latestError,
    refetch: refetchLatest,
  } = useQuery({
    queryKey: ['latestTickets', transportType],
    queryFn: async () => {
      try {
        const params = transportType !== 'all' ? { transportType } : {};
        const response = await axiosSecure.get('/api/tickets/latest', {
          params,
        });
        // console.log('Latest API Response:');

        // Handle different response formats
        const tickets =
          response.data?.tickets ||
          response.data?.data?.tickets ||
          response.data?.data ||
          response.data ||
          [];

        return Array.isArray(tickets) ? tickets : [];
      } catch (error) {
        console.error('Error fetching latest tickets:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch latest tickets'
        );
      }
    },
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
  });

  // Generate mock data fallback with safe string operations
  // Home.jsx - শুধু generateMockTickets ফাংশন আপডেট করি
  const generateMockTickets = (type, count = 6) => {
    const transportTypes = ['bus', 'train', 'launch', 'plane'];
    const destinations = [
      'Chittagong',
      'Sylhet',
      "Cox's Bazar",
      'Rajshahi',
      'Khulna',
      'Barisal',
    ];
    const vendors = [
      'Premium Express',
      'Super Travels',
      'Green Line',
      'Shohagh Paribahan',
      'Hanif Enterprise',
      'Soudia Coach',
    ];

    return Array(count)
      .fill(null)
      .map((_, i) => {
        const departureDate = new Date();
        departureDate.setDate(departureDate.getDate() + i + 1);

        const transport = transportTypes[i % 4];
        const transportCapitalized = transport
          ? transport.charAt(0).toUpperCase() + transport.slice(1)
          : 'Transport';

        const departureHour = 8 + (i % 12);
        const departureTimeString = `${departureHour}:${
          i % 2 === 0 ? '00' : '30'
        } ${departureHour >= 12 ? 'PM' : 'AM'}`;

        return {
          _id: `${type}-${i}-${Date.now()}`,
          title: `${
            type === 'Featured' ? 'Featured ' : ''
          }${transportCapitalized} Service ${i + 1}`,
          from: 'Dhaka',
          to: destinations[i % destinations.length],
          departure: departureDate.toISOString(), // ✅ ISO format এ রাখুন
          departureTime: departureTimeString, // ✅ string format এ সময়
          price: 550 + i * 45,
          transportType: transport,
          quantity: 25 + i * 3,
          availableQuantity: 15 + i,
          perks: ['AC', 'WiFi', 'Water', 'Snacks'].slice(0, (i % 3) + 1),
          image: `https://images.unsplash.com/photo-${
            ['1544620347', '1593642632827', '1566836610', '1512295767273'][
              i % 4
            ]
          }?auto=format&fit=crop&w=800&q=80`,
          verificationStatus: 'approved',
          isAdvertised: type === 'Featured',
          vendorName: vendors[i % vendors.length],
          vendorEmail: 'vendor@example.com',
          isHidden: false,
          createdAt: new Date().toISOString(),
          discount:
            type === 'Featured' ? Math.floor(Math.random() * 30) + 10 : 0,
        };
      });
  };

  // ✅ FIX: Safe data handling
  const getAdvertisedTickets = () => {
    if (!advertisedData) {
      // console.log('Using mock advertised tickets');
      return generateMockTickets('Featured');
    }

    // Filter out invalid tickets
    const validTickets = advertisedData.filter(
      ticket => ticket && ticket._id && ticket.title && ticket.transportType
    );

    return validTickets.length > 0
      ? validTickets
      : generateMockTickets('Featured');
  };

  const getLatestTickets = () => {
    if (!latestData) {
      // console.log('Using mock latest tickets');
      return generateMockTickets('Latest', 8);
    }

    // Filter out invalid tickets
    const validTickets = latestData.filter(
      ticket => ticket && ticket._id && ticket.title && ticket.transportType
    );

    return validTickets.length > 0
      ? validTickets
      : generateMockTickets('Latest', 8);
  };

  // Use safe data getters
  const advertisedTickets = getAdvertisedTickets();
  const latestTickets = getLatestTickets();

  // Filter latest tickets by transport type with safe checks
  const filteredLatestTickets = React.useMemo(() => {
    if (transportType === 'all') {
      return latestTickets;
    }

    return latestTickets.filter(ticket => {
      // ✅ FIX: Safe type comparison
      if (!ticket || !ticket.transportType) return false;
      return ticket.transportType.toLowerCase() === transportType.toLowerCase();
    });
  }, [latestTickets, transportType]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchData.from && searchData.to) {
      const queryParams = new URLSearchParams({
        from: searchData.from,
        to: searchData.to,
        ...(searchData.date && { date: searchData.date }),
        ...(transportType !== 'all' && { transportType }),
      }).toString();

      navigate(`/all-tickets?${queryParams}`);
    } else {
      alert('Please enter both From and To locations');
    }
  };

  const stats = [
    {
      number: '95K+',
      label: 'Happy Users',
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      number: '1.2K+',
      label: 'Daily Routes',
      icon: <FaRoute className="text-green-500" />,
    },
    {
      number: '24/7',
      label: 'Support',
      icon: <FaHeadset className="text-purple-500" />,
    },
    {
      number: '100%',
      label: 'Secure',
      icon: <FaShieldAlt className="text-orange-500" />,
    },
  ];

  // Error Component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="text-center py-12">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-8 max-w-md mx-auto">
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          {error?.message || 'Failed to load data'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 px-6 py-3 rounded-xl font-semibold transition-colors mx-auto"
          >
            <FaSync /> Try Again
          </button>
        )}
      </div>
    </div>
  );

  // Loading Skeleton
  const TicketSkeleton = ({ count = 3 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl p-6">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* HERO SECTION */}
      <section
        className={`relative pt-28 md:pt-32 pb-20 px-4 overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-950'
            : 'bg-gradient-to-br from-[#043674] via-[#0E3F88] to-[#0F2F67]'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:32px_32px]" />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* trust badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/12 backdrop-blur-lg border border-white/25 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs md:text-sm text-slate-50 font-medium">
              Trusted by 100,000+ travelers
            </span>
          </div>

          {/* main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-1">
            Book Your Next
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B]">
              Adventure Today
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover and book bus, train, launch & flight tickets easily.
            Seamless travel experience at your fingertips.
          </p>

          {/* search card */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white shadow-2xl rounded-[2.5rem] px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row gap-3 items-stretch"
            >
              {/* from */}
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaMapMarkerAlt />
                </span>
                <input
                  type="text"
                  placeholder="From (e.g., Dhaka)"
                  required
                  className="w-full pl-10 pr-4 py-3 md:py-4 rounded-2xl border border-slate-200 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                  value={searchData.from}
                  onChange={e =>
                    setSearchData(prev => ({ ...prev, from: e.target.value }))
                  }
                />
              </div>

              {/* to */}
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaMapMarkerAlt />
                </span>
                <input
                  type="text"
                  placeholder="To (e.g., Chittagong)"
                  required
                  className="w-full pl-10 pr-4 py-3 md:py-4 rounded-2xl border border-slate-200 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                  value={searchData.to}
                  onChange={e =>
                    setSearchData(prev => ({ ...prev, to: e.target.value }))
                  }
                />
              </div>

              {/* date */}
              <div className="relative flex-[0.9]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 md:py-4 rounded-2xl border border-slate-200 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                  value={searchData.date}
                  onChange={e =>
                    setSearchData(prev => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>

              {/* button */}
              <button
                type="submit"
                disabled={!searchData.from || !searchData.to}
                className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-semibold text-sm md:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSearch />
                <span>Search Tickets</span>
              </button>
            </form>
          </div>

          {/* stats under hero */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl px-3 py-4 border border-white/10 text-left flex flex-col gap-1"
              >
                <div className="text-xs text-blue-100/80 flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span>{s.label}</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {s.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 px-4 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-3xl mb-3 flex justify-center">{s.icon}</div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {s.number}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED TICKETS */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 italic">
                Featured Offers
              </h2>
              <div className="h-1.5 w-24 bg-orange-500 rounded-full" />
            </div>
            {advertisedTickets.length > 0 && (
              <button
                onClick={() => navigate('/all-tickets')}
                className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
              >
                View All <FaArrowRight />
              </button>
            )}
          </div>

          {loadingAdvertised ? (
            <TicketSkeleton count={3} />
          ) : advertisedError ? (
            <ErrorDisplay error={advertisedError} onRetry={refetchAdvertised} />
          ) : advertisedTickets.length === 0 ? (
            <div className="text-center py-16">
              <FaStar className="text-5xl text-yellow-400 mx-auto mb-4 opacity-60" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                No Featured Tickets Available
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                Check back soon for special offers!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {advertisedTickets.map((ticket, index) => {
                // ✅ FIX: Safe ticket validation
                if (!ticket || !ticket._id) {
                  console.warn(`Invalid ticket at index ${index}:`, ticket);
                  return null; // Skip invalid tickets
                }

                return (
                  <div
                    key={ticket._id || index}
                    className="transform hover:scale-[1.03] transition-all duration-300"
                  >
                    <TicketCard ticket={ticket} featured />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. SERVICES EXPLORER */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Services
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            We offer premium travel solutions across multiple transport modes
            with a focus on safety and comfort.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaBus />,
              label: 'Luxury Bus',
              desc: 'AC / Non-AC sleeper coaches',
              color: 'from-blue-500 to-blue-700',
              type: 'bus',
            },
            {
              icon: <FaTrain />,
              label: 'Express Train',
              desc: 'Intercity high-speed trains',
              color: 'from-green-500 to-green-700',
              type: 'train',
            },
            {
              icon: <FaShip />,
              label: 'River Cruise',
              desc: 'Luxury launch cabins',
              color: 'from-cyan-500 to-cyan-700',
              type: 'launch',
            },
            {
              icon: <FaPlane />,
              label: 'Air Ticket',
              desc: 'Domestic & international flights',
              color: 'from-indigo-500 to-indigo-700',
              type: 'plane',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all border border-transparent hover:border-blue-500/30"
              onClick={() => {
                setTransportType(item.type);
                navigate('/all-tickets', {
                  state: { transportType: item.type },
                });
              }}
            >
              <div
                className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} text-white rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl group-hover:rotate-6 transition-transform`}
              >
                {item.icon}
              </div>
              <h4 className="font-black text-xl mb-2 dark:text-white uppercase tracking-wide">
                {item.label}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LATEST UPDATES CAROUSEL */}
      <section className="py-20 px-4 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
              <FaClock className="text-orange-500" />
              Recently Added Routes
            </h2>

            {/* Transport Type Filter */}
            <div className="flex items-center gap-3">
              <select
                value={transportType}
                onChange={e => setTransportType(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="all">All Transports</option>
                <option value="bus">Bus Only</option>
                <option value="train">Train Only</option>
                <option value="launch">Launch Only</option>
                <option value="plane">Plane Only</option>
              </select>
            </div>
          </div>

          {loadingLatest ? (
            <TicketSkeleton count={4} />
          ) : latestError ? (
            <ErrorDisplay error={latestError} onRetry={refetchLatest} />
          ) : filteredLatestTickets.length === 0 ? (
            <div className="text-center py-16">
              <FaClock className="text-5xl text-gray-400 mx-auto mb-4 opacity-60" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                No Recent Tickets
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                {transportType !== 'all'
                  ? `No ${transportType} tickets available at the moment`
                  : 'New tickets will appear here soon!'}
              </p>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              loop={filteredLatestTickets.length > 3}
              className="pb-16"
            >
              {filteredLatestTickets.map((ticket, index) => {
                // ✅ FIX: Safe ticket validation for Swiper
                if (!ticket || !ticket._id) {
                  console.warn(
                    `Invalid ticket in Swiper at index ${index}:`,
                    ticket
                  );
                  return null;
                }

                return (
                  <SwiperSlide key={ticket._id}>
                    <div className="p-2">
                      <TicketCard ticket={ticket} />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-20">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
              alt="Bus Journey"
              className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white dark:border-gray-800 w-full h-auto"
            />

            <div className="absolute -bottom-10 -right-10 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl z-20 border-l-8 border-orange-500 animate-pulse">
              <p className="text-5xl font-black text-gray-900 dark:text-white">
                12+
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-bold">
                Partnerships
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
              We focus on <span className="text-blue-600">your comfort</span>
            </h2>

            <div className="grid gap-6">
              {[
                {
                  icon: <FaClock />,
                  t: 'Real-time Support',
                  d: 'Our support team is available 24/7 to assist you.',
                },
                {
                  icon: <FaMoneyBillWave />,
                  t: 'No Hidden Costs',
                  d: 'Transparent pricing so you always know what you pay.',
                },
                {
                  icon: <FaShieldAlt />,
                  t: 'Secure Checkout',
                  d: 'Bank-level encryption keeps your payments safe.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 shadow-lg rounded-2xl flex items-center justify-center text-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold dark:text-white">
                      {item.t}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. APP DOWNLOAD CTA */}
      <section className="py-20 px-4">
        <div
          className={`max-w-7xl mx-auto rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden ${
            theme === 'dark' ? 'bg-indigo-950' : 'bg-blue-600'
          } text-white`}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 italic leading-none">
                Save up to 30%
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-lg mx-auto lg:mx-0">
                Download our mobile app and use code{' '}
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-lg font-bold">
                  TRAVEL30
                </span>{' '}
                on your first booking.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="bg-black flex items-center gap-4 px-8 py-4 rounded-2xl hover:scale-105 transition-transform border border-white/20">
                  <FaMobileAlt className="text-3xl text-orange-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] uppercase opacity-60">
                      Available on
                    </p>
                    <p className="text-lg font-bold">Google Play</p>
                  </div>
                </button>

                <button className="bg-white text-black flex items-center gap-4 px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl">
                  <FaLock className="text-3xl text-blue-600" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] uppercase opacity-60">
                      Coming soon on
                    </p>
                    <p className="text-lg font-bold">App Store</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <FaMobileAlt className="text-[250px] opacity-10 rotate-12 absolute -top-20 -right-20" />
              <FaTicketAlt className="text-[200px] opacity-20 -rotate-12" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
