// ========== 3. MyAddedTickets.jsx ==========
import { useEffect, useState } from 'react';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { AuthContext } from '../../../AuthContext';
import { useAuth } from '../../../contexts/AuthProvider';

const MyAddedTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/vendor/${user.email}`
      );
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`);
      toast.success('Ticket deleted successfully');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-3xl font-bold mb-6">My Added Tickets</h1>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div
              key={ticket._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={ticket.image}
                alt={ticket.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{ticket.title}</h3>
                <p className="text-gray-600 mb-2">
                  {ticket.from} → {ticket.to}
                </p>
                <p className="text-gray-600 mb-2">
                  {ticket.transportType} • ${ticket.price}
                </p>

                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      ticket.verificationStatus
                    )}`}
                  >
                    {ticket.verificationStatus.toUpperCase()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    disabled={ticket.verificationStatus === 'rejected'}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    disabled={ticket.verificationStatus === 'rejected'}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tickets added yet</p>
      )}
    </div>
  );
};

export default MyAddedTickets;
