// ========== 4. src/components/dashboard/admin/AdvertiseTickets.jsx ==========
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advertisedCount, setAdvertisedCount] = useState(0);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`/api/tickets/admin/all`);

      // Filter only approved tickets
      const approvedTickets = response.data.filter(
        ticket => ticket.verificationStatus === 'approved' && !ticket.isHidden
      );

      setTickets(approvedTickets);

      // Count advertised tickets
      const count = approvedTickets.filter(t => t.isAdvertised).length;
      setAdvertisedCount(count);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdvertise = async (ticketId, currentStatus) => {
    // Check if trying to advertise when already at max
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
        !currentStatus
          ? 'Ticket advertised successfully'
          : 'Ticket removed from advertisements'
      );
      fetchTickets();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update advertisement status'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Advertise Tickets</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          Advertised: {advertisedCount} / 6
        </div>
      </div>

      {advertisedCount >= 6 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Maximum Limit Reached</p>
          <p>
            You have reached the maximum limit of 6 advertised tickets. Remove
            one to add another.
          </p>
        </div>
      )}

      {tickets.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Route</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Transport</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id} className="border-t">
                  <td className="px-6 py-4">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm">
                    {ticket.from} → {ticket.to}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    ${ticket.price}
                  </td>
                  <td className="px-6 py-4">{ticket.transportType}</td>
                  <td className="px-6 py-4">
                    {ticket.isAdvertised ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        ✓ ADVERTISED
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        NOT ADVERTISED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ticket.isAdvertised}
                        onChange={() =>
                          handleToggleAdvertise(ticket._id, ticket.isAdvertised)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {ticket.isAdvertised ? 'On' : 'Off'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No approved tickets available to advertise
        </p>
      )}
    </div>
  );
};

export default AdvertiseTickets;

// ==========================================
// EXPORT ALL ADMIN COMPONENTS
// ==========================================

// In your dashboard/admin/index.js (if you want to organize exports)
/*
export { default as AdminProfile } from './AdminProfile';
export { default as ManageTickets } from './ManageTickets';
export { default as ManageUsers } from './ManageUsers';
export { default as AdvertiseTickets } from './AdvertiseTickets';
*/
