import { ReactComponent } from 'react';

export default function Footer() {
  return (
    <footer className="glass dark:glass-dark border-t-0">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <svg
                  className="w-9 h-9 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 4h18v2H3zm0 7h12v2H3zm0 7h18v2H3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  TicketBari
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Premium Travel Booking
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Bangladesh's premium ticket booking platform. Fast, secure,
              reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {['Home', 'All Tickets', 'About', 'Contact'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 group-hover:translate-x-2 transition-all"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <span>support@ticketbari.com</span>
              </li>
              <li className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <span>+880 1711 123456</span>
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
              Secure Payments
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {['visa', 'mastercard', 'bKash', 'rocket'].map(method => (
                <div
                  key={method}
                  className="glass p-4 rounded-2xl hover:bg-white/50 transition-all cursor-pointer"
                >
                  <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-sm uppercase tracking-wide">
                      {method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 dark:border-gray-700/50 mt-16 pt-12 text-center">
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            © 2025 TicketBari. All rights reserved. Made with ❤️ in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
