import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; // path adjust করো
import toast from 'react-hot-toast';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const axiosSecure = useAxiosSecure();
  const ticketsPerPage = 10;

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    // Filter tickets based on search and status
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        ticket =>
          ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        ticket => ticket.verificationStatus === statusFilter
      );
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/api/tickets/admin/all');

      // Safety check
      const ticketData = Array.isArray(response.data) ? response.data : [];
      setTickets(ticketData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async id => {
    try {
      await axiosSecure.patch(`/api/tickets/${id}/approve`);
      toast.success('Ticket approved successfully');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to approve ticket');
    }
  };

  const handleReject = async id => {
    try {
      await axiosSecure.patch(`/api/tickets/${id}/reject`);
      toast.success('Ticket rejected');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to reject ticket');
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tickets</h1>
          <p className="text-gray-600 mt-1">
            {filteredTickets.length} of {tickets.length} tickets
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, route, or vendor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredTickets.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentTickets.map(ticket => (
                    <tr
                      key={ticket._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={ticket.image || '/placeholder-image.jpg'}
                          alt={ticket.title}
                          className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          onError={e => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {ticket.title}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {ticket.transportType}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {ticket.from} → {ticket.to}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600 text-lg">
                          ৳{ticket.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {ticket.vendorName}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">
                          {ticket.vendorEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            ticket.verificationStatus
                          )}`}
                        >
                          {ticket.verificationStatus?.toUpperCase() ||
                            'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.verificationStatus === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(ticket._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 text-sm font-medium shadow-sm transition-all flex items-center gap-1"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(ticket._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 text-sm font-medium shadow-sm transition-all flex items-center gap-1"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{indexOfFirstTicket + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastTicket, filteredTickets.length)}
                </span>{' '}
                of <span className="font-medium">{filteredTickets.length}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                        currentPage === number
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-6a2 2 0 012 2v3a2 2 0 01-2 2h-.5"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={fetchTickets}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
