// components/payments/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiDownload,
  FiHome,
  FiCalendar,
  FiUser,
  FiMail,
  FiMapPin,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const data = location.state || {};

    if (!data.bookingId) {
      toast.error('Invalid booking information');
      navigate('/dashboard/my-bookings');
      return;
    }

    setBookingData(data);

    // Store in localStorage for persistence
    localStorage.setItem('lastBooking', JSON.stringify(data));
  }, [location, navigate]);

  const handlePrintTicket = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${bookingData?.ticketTitle || 'Booking'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .ticket { border: 2px dashed #000; padding: 20px; max-width: 500px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .success { color: #10B981; font-weight: bold; }
            .details { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .barcode { text-align: center; margin: 30px 0; font-family: monospace; letter-spacing: 3px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>🎫 TicketBari</h1>
              <h2 class="success">✓ PAYMENT SUCCESSFUL</h2>
            </div>
            <div class="details">
              <div class="row"><strong>Booking ID:</strong> ${
                bookingData?.bookingId || ''
              }</div>
              <div class="row"><strong>Passenger:</strong> ${
                bookingData?.passengerName || ''
              }</div>
              <div class="row"><strong>Route:</strong> ${
                bookingData?.from || ''
              } → ${bookingData?.to || ''}</div>
              <div class="row"><strong>Date:</strong> ${
                bookingData?.departure
                  ? new Date(bookingData.departure).toLocaleString()
                  : ''
              }</div>
              <div class="row"><strong>Tickets:</strong> ${
                bookingData?.quantity || ''
              }</div>
              <div class="row"><strong>Total Paid:</strong> $${
                bookingData?.amount || ''
              }</div>
            </div>
            <div class="barcode">
              <div>${(bookingData?.bookingId || '')
                .slice(-12)
                .toUpperCase()}</div>
              <div style="height: 2px; background: #000; margin: 5px 0;"></div>
              <div style="height: 2px; background: #000; margin: 5px 0;"></div>
            </div>
            <div class="footer">
              <p>Present this ticket at the counter</p>
              <p>Thank you for choosing TicketBari</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadTicket = () => {
    toast.success('Ticket downloaded successfully!');
    // In real implementation, generate PDF here
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <FiCheckCircle className="w-12 h-12" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
            <p className="text-lg opacity-90">
              Your tickets have been booked successfully
            </p>
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-sm font-mono">
                Booking ID: {bookingData.bookingId}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <FiCalendar className="mr-3 text-green-500" />
                  Booking Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Passenger Name
                      </p>
                      <p className="text-lg font-semibold flex items-center">
                        <FiUser className="mr-2" />
                        {bookingData.passengerName}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Number of Tickets
                      </p>
                      <p className="text-lg font-semibold">
                        {bookingData.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Route
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {bookingData.from} → {bookingData.to}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiMapPin className="mr-2" />
                        {bookingData.from}
                      </div>
                      <div className="flex-1 border-t border-dashed border-gray-300"></div>
                      <div className="flex items-center">
                        <FiMapPin className="mr-2" />
                        {bookingData.to}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Departure Time
                      </p>
                      <p className="font-medium">
                        {formatDate(bookingData.departure)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Transport Type
                      </p>
                      <p className="font-medium">
                        {bookingData.transportType || 'Bus'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ticket Title
                    </p>
                    <p className="font-medium text-lg">
                      {bookingData.ticketTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barcode Section */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Your Ticket</h3>
                <div className="text-center">
                  <div className="font-mono text-2xl tracking-widest mb-2 p-4 bg-white dark:bg-gray-800 rounded-lg">
                    {(bookingData.bookingId || '').slice(-12).toUpperCase()}
                  </div>
                  <div className="h-12 bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-gray-400 dark:to-white rounded mb-2"></div>
                  <p className="text-sm text-gray-500">
                    Scan this barcode at the boarding point
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Summary & Actions */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Ticket Price
                    </span>
                    <span>
                      $${(bookingData.amount / bookingData.quantity).toFixed(2)}{' '}
                      × {bookingData.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span>$${bookingData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Service Fee
                    </span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Paid</span>
                      <span className="text-green-500 text-2xl">
                        $${bookingData.amount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">
                        Payment Verified
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Completed on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Your Ticket</h3>
                <div className="space-y-3">
                  <button
                    onClick={handlePrintTicket}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition"
                  >
                    <FiDownload className="mr-2" />
                    Print Ticket
                  </button>

                  <button
                    onClick={handleDownloadTicket}
                    className="w-full border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 py-3 rounded-lg font-medium flex items-center justify-center transition"
                  >
                    <FiDownload className="mr-2" />
                    Download PDF
                  </button>

                  <Link
                    to="/dashboard/my-bookings"
                    className="block text-center border border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 rounded-lg font-medium transition"
                  >
                    View All Bookings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions & Next Steps */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Next Steps & Important Information
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-500 font-bold text-xl">1</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Save Your Ticket</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Print or save digital copy of your ticket. It's required for
                  boarding.
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-500 font-bold text-xl">2</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Arrive Early</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Please arrive at least 45 minutes before the scheduled
                  departure time.
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-500 font-bold text-xl">3</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Required Documents</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Bring a valid government-issued photo ID matching the
                  passenger name.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-8">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition"
              >
                <FiHome className="mr-2" />
                Back to Homepage
              </Link>

              <Link
                to="/all-tickets"
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition"
              >
                <FiCalendar className="mr-2" />
                Book More Tickets
              </Link>

              <Link
                to="/dashboard/my-bookings"
                className="px-6 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center transition"
              >
                <FiUser className="mr-2" />
                My Bookings
              </Link>
            </div>

            <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>
                For any queries, contact support@ticketbari.com or call +880
                1234 567890
              </p>
              <p className="mt-2">
                Thank you for choosing TicketBari. Have a safe journey! 🚌
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
