import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update DOM
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);

    // Save preference
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 rounded-full w-14 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Toggle handle */}
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-lg transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {/* Sun/Moon icon inside handle */}
        <span className="absolute inset-0 flex items-center justify-center">
          {theme === 'dark' ? (
            <FaMoon className="w-3 h-3 text-gray-700" />
          ) : (
            <FaSun className="w-3 h-3 text-yellow-500" />
          )}
        </span>
      </span>

      {/* Background icons */}
      <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <FaSun
          className={`w-3 h-3 transition-opacity duration-300 ${
            theme === 'light'
              ? 'opacity-100 text-yellow-500'
              : 'opacity-40 text-gray-500'
          }`}
        />
      </span>
      <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <FaMoon
          className={`w-3 h-3 transition-opacity duration-300 ${
            theme === 'dark'
              ? 'opacity-100 text-blue-400'
              : 'opacity-40 text-gray-500'
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
