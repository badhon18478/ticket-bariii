import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  LogOut,
  Ticket,
  Home,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  ShoppingBag,
  Search,
  BarChart2,
  BarChart3,
} from 'lucide-react';
import { Bus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthProvider';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Dashboard এর মধ্যে থাকলে Navbar hide করো
  const isDashboard = location.pathname.startsWith('/dashboard');
  if (isDashboard) {
    return null;
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      await logout();
      toast.success('Logged out successfully! 👋');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getRoleIcon = () => {
    if (userRole === 'admin')
      return <Shield className="w-4 h-4 text-purple-500" />;
    if (userRole === 'vendor')
      return <ShoppingBag className="w-4 h-4 text-green-500" />;
    return <User className="w-4 h-4 text-blue-500" />;
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-purple-700';
      case 'vendor':
        return 'bg-gradient-to-r from-green-500 to-green-700';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-700';
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/all-tickets?search=${searchTerm}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    {
      path: '/all-tickets',
      label: 'All Tickets',
      icon: Ticket,
      protected: true,
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: BarChart2,
      protected: true,
    },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    scrolled
      ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl py-3 border-b border-gray-200/50 dark:border-slate-800/50'
      : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg py-4 border-b border-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Premium Design */}
          <Link
            to="/"
            className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFA53A] to-[#FF7A1B] rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:rotate-6 transition-all duration-300">
              <Bus className="text-white w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 via-gray-800 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Ticket
                <span className="text-[#FF7A1B] drop-shadow-lg">Bari</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Search Bar - Premium */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets, routes, destinations..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A1B]/50 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation - Premium */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map(link => {
              if (link.protected && !user) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FFA53A]/10 hover:to-[#FF7A1B]/10 hover:text-[#FF7A1B] dark:hover:text-[#FFA53A] shadow-sm hover:shadow-md border border-transparent hover:border-[#FFA53A]/20 dark:hover:border-[#FF7A1B]/20 text-gray-700 dark:text-gray-300"
                >
                  <Icon className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-yellow-400'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700'
              } hover:from-[#FFA53A] hover:to-[#FF7A1B] hover:text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Dropdown - Premium */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all duration-300 shadow-lg hover:shadow-xl group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-800/50"
                >
                  <div className="relative">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${
                          user.displayName || 'User'
                        }&background=FF7A1B&color=fff&size=128`
                      }
                      alt={user.displayName}
                      className="w-12 h-12 rounded-2xl object-cover border-3 border-white/50 dark:border-slate-900/50 shadow-lg group-hover:border-[#FF7A1B] transition-all"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 ${getRoleBadgeColor()} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900`}
                    >
                      {getRoleIcon()}
                    </div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                      {user.displayName?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">
                      {userRole || 'User'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Premium Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800/50 py-3 z-50">
                    <div className="px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {user.displayName || 'Welcome Back!'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="space-y-1 px-4 py-3">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#FFA53A]/10 hover:to-[#FF7A1B]/10 transition-all font-medium text-gray-700 dark:text-gray-300 hover:text-[#FF7A1B]"
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard/user-profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#FFA53A]/10 hover:to-[#FF7A1B]/10 transition-all font-medium text-gray-700 dark:text-gray-300 hover:text-[#FF7A1B]"
                      >
                        <User className="w-5 h-5" />
                        <span>My Profile</span>
                      </Link>
                      {userRole === 'user' && (
                        <Link
                          to="/dashboard/my-bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#FFA53A]/10 hover:to-[#FF7A1B]/10 transition-all font-medium text-gray-700 dark:text-gray-300 hover:text-[#FF7A1B]"
                        >
                          <Ticket className="w-5 h-5" />
                          <span>My Bookings</span>
                        </Link>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200/50 dark:border-slate-700/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 font-medium transition-all duration-300"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons - Premium */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-slate-700 hover:border-[#FF7A1B] hover:text-[#FF7A1B] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] hover:from-[#FF7A1B] hover:to-[#FFA53A] text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button className="p-2.5 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:from-[#FFA53A] hover:to-[#FF7A1B] hover:text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800 text-yellow-400'
                  : 'bg-gray-200 text-gray-700'
              } hover:from-[#FFA53A] hover:to-[#FF7A1B] hover:text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-[#FF7A1B] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Premium */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-800/50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A1B]"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            {navLinks.map(link => {
              if (link.protected && !user) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#FFA53A]/20 hover:to-[#FF7A1B]/20 hover:text-[#FF7A1B] transition-all shadow-sm hover:shadow-md"
                >
                  <span className="w-8 h-8 text-[#FF7A1B] flex items-center justify-center rounded-xl bg-[#FFA53A]/10 dark:bg-[#FF7A1B]/30">
                    <Icon className="w-5 h-5" />
                  </span>
                  {link.label}
                </Link>
              );
            })}

            {user ? (
              <>
                <div className="pt-4 border-t border-gray-200/50 dark:border-slate-800/50">
                  <div className="flex items-center space-x-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FFA53A]/10 to-[#FF7A1B]/10 dark:from-[#FF7A1B]/20 dark:to-[#FFA53A]/20">
                    <div className="relative">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${
                            user.displayName || 'User'
                          }&background=FF7A1B&color=fff`
                        }
                        alt={user.displayName}
                        className="w-12 h-12 rounded-2xl object-cover border-3 border-white dark:border-slate-900 shadow-lg"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 ${getRoleBadgeColor()} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900`}
                      >
                        {getRoleIcon()}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {user.displayName?.split(' ')[0] || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {userRole || 'Member'}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#FFA53A]/20 hover:to-[#FF7A1B]/20 hover:text-[#FF7A1B] transition-all shadow-sm hover:shadow-md"
                >
                  <BarChart3 className="w-8 h-8 text-[#FF7A1B]" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/dashboard/user-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#FFA53A]/20 hover:to-[#FF7A1B]/20 hover:text-[#FF7A1B] transition-all shadow-sm hover:shadow-md"
                >
                  <User className="w-8 h-8 text-[#FF7A1B]" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-lg font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-8 h-8" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-200/50 dark:border-slate-800/50 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-8 py-4 rounded-2xl text-lg font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-slate-800 hover:border-[#FF7A1B] hover:text-[#FF7A1B] bg-white/50 dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-8 py-4 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] hover:from-[#FF7A1B] hover:to-[#FFA53A] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
