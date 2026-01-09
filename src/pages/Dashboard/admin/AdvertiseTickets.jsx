import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTickets();
  }, []);

  const fetchApprovedTickets = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/approved`
      );
      setTickets(data.tickets);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdvertise = async (ticketId, currentStatus) => {
    const advertisedCount = tickets.filter(t => t.isAdvertised).length;

    if (!currentStatus && advertisedCount >= 6) {
      toast.error('Maximum 6 tickets can be advertised at a time');
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/advertise`,
        { isAdvertised: !currentStatus }
      );
      toast.success(
        currentStatus ? 'Ticket unadvertised' : 'Ticket advertised successfully'
      );
      fetchApprovedTickets();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update advertisement'
      );
    }
  };

  const advertisedTickets = tickets.filter(t => t.isAdvertised);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Advertise Tickets
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {advertisedTickets.length} / 6 tickets advertised
        </div>
      </div>

      {/* Info Banner */}
      <div className="card bg-blue-50 dark:bg-blue-900 mb-8">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Advertisement Guidelines
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• You can advertise up to 6 tickets at a time</li>
              <li>
                • Advertised tickets will appear in the homepage Advertisement
                Section
              </li>
              <li>• Only approved tickets can be advertised</li>
              <li>• Toggle the switch to advertise or unadvertise tickets</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Currently Advertised Tickets */}
      {advertisedTickets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Currently Advertised Tickets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisedTickets.map(ticket => (
              <div key={ticket._id} className="card border-2 border-green-500">
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Advertised
                  </span>
                </div>
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  {ticket.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {ticket.from} → {ticket.to}
                </p>
                <button
                  onClick={() =>
                    handleToggleAdvertise(ticket._id, ticket.isAdvertised)
                  }
                  className="btn-secondary w-full"
                >
                  <FiToggleRight className="inline mr-2" />
                  Unadvertise
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Approved Tickets Table */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        All Approved Tickets
      </h3>
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tickets.map(ticket => (
              <tr
                key={ticket._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {ticket.transportType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {ticket.from} → {ticket.to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                  ${ticket.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>{ticket.vendorName}</div>
                  <div className="text-gray-500 text-xs">
                    {ticket.vendorEmail}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ticket.isAdvertised ? (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Advertised
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Not Advertised
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() =>
                      handleToggleAdvertise(ticket._id, ticket.isAdvertised)
                    }
                    disabled={
                      !ticket.isAdvertised && advertisedTickets.length >= 6
                    }
                    className={`flex items-center space-x-2 px-4 py-2 rounded transition-all ${
                      ticket.isAdvertised
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {ticket.isAdvertised ? (
                      <>
                        <FiToggleRight />
                        <span>Unadvertise</span>
                      </>
                    ) : (
                      <>
                        <FiToggleLeft />
                        <span>Advertise</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertiseTickets;
