import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navber/Navbar';
import { Outlet, useLocation } from 'react-router';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  return (
    <div>
      <title>Home</title>
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        <div></div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Outlet></Outlet>
        )}
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default MainLayout;
