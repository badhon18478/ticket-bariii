import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaBus,
} from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaBus className="text-3xl text-blue-400" />
              <span className="text-2xl font-bold">TicketBari</span>
            </div>
            <p className="text-gray-300 mb-6">
              Book bus, train, launch & flight tickets easily. Your one-stop
              solution for all travel needs.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-tickets"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  All Tickets
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400" />
                <span className="text-gray-300">support@ticketbari.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <span className="text-gray-300">+880 1234-567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaFacebook className="text-blue-400" />
                <span className="text-gray-300">TicketBari Official</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h3 className="text-xl font-bold mb-6">Payment Methods</h3>
            <div className="flex items-center space-x-4 mb-4">
              <SiStripe className="text-4xl text-purple-400" />
              <span className="text-gray-300 font-medium">Stripe</span>
            </div>
            <p className="text-gray-300 text-sm">
              Secure payments powered by Stripe. We accept all major credit
              cards.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            © {currentYear} TicketBari. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Made with ❤️ for travelers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
