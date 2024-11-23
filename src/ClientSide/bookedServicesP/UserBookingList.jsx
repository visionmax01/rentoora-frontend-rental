import React, { useEffect, useState } from 'react';
import Api from '../../utils/Api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSync, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const UserBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch the bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await Api.get('/booked/user/bookings');
        console.log('Raw bookings:', response.data);

        const statusOrder = {
          'PENDING': 1,
          'CONFIRMED': 2,
          'COMPLETED': 3,
          'CANCELLED': 4
        };

        const sortedBookings = [...response.data].sort((a, b) => {
          const statusA = a.bookingStatus.toUpperCase();
          const statusB = b.bookingStatus.toUpperCase();
          
          const statusComparison = (statusOrder[statusA] || 999) - (statusOrder[statusB] || 999);
          
          if (statusComparison !== 0) {
            return statusComparison;
          }
          
          const dateA = new Date(a.bookingDate || a.date || a.createdAt);
          const dateB = new Date(b.bookingDate || b.date || b.createdAt);
          return dateB - dateA;
        });

        console.log('Sorted bookings:', sortedBookings);
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error fetching bookings');
      }
    };
    fetchBookings();
  }, []);

  // Calculate pagination indexes
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Handle search input and filter the bookings by ID
  const handleSearch = () => {
    setCurrentPage(1);
    if (searchTerm) {
      const filtered = bookings.filter((booking) => booking.bookingId.toString().includes(searchTerm));
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setIsCanceling(true);
    try {
      const response = await Api.patch(`/booked/booking/cancel/${bookingId}`);
      if (response.status === 200) {
        setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
        setFilteredBookings(filteredBookings.filter((booking) => booking.bookingId !== bookingId));
        toast.success('Booking canceled successfully!');
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error cancelling booking');
      toast.error('Error cancelling booking');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    try {
      const response = await Api.get('/booked/user/bookings');
      
      const statusOrder = {
        'PENDING': 1,
        'CONFIRMED': 2,
        'COMPLETED': 3,
        'CANCELLED': 4
      };

      const sortedBookings = [...response.data].sort((a, b) => {
        const statusA = a.bookingStatus.toUpperCase();
        const statusB = b.bookingStatus.toUpperCase();
        
        const statusComparison = (statusOrder[statusA] || 999) - (statusOrder[statusB] || 999);
        
        if (statusComparison !== 0) {
          return statusComparison;
        }
        
        const dateA = new Date(a.bookingDate || a.date || a.createdAt);
        const dateB = new Date(b.bookingDate || b.date || b.createdAt);
        return dateB - dateA;
      });

      setBookings(sortedBookings);
      setFilteredBookings(sortedBookings);
      toast.success('Bookings refreshed!');
    } catch (err) {
      setError('Error refreshing bookings');
      toast.error('Error refreshing bookings');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="container h-screen overflow-y-auto mx-auto px-4 bg-gradient-to-r from-blue-100 to-purple-100 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Bookings</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative w-full sm:w-1/4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleSearch}
            placeholder="Search by Booking ID"
            className="w-full p-2 text-black border border-gray-300 rounded-md"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-3 right-3 text-gray-500"
            onClick={handleSearch}
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`w-full sm:w-auto p-2 rounded-md text-white ${isRefreshing ? 'bg-gray-500' : 'bg-blue-500'} hover:bg-blue-600 transition flex items-center justify-center`}
        >
          {isRefreshing && (
            <FontAwesomeIcon icon={faSync} spin className="mr-2" />
          )}
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className='bg-gray-100 text-left text-sm font-medium text-gray-700'>
              <th scope="col" className="py-3 px-6 hidden sm:table-cell">
                #
              </th>
              <th scope="col" className="py-3 px-6">
                Booking ID
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Service Type
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Booking Date
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Time Slot
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBookings.map((booking, index) => (
              <tr key={booking.bookingId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {indexOfFirstBooking + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                  <div className="text-xs text-gray-500">
                    Created: {formatDateTime(booking.createdAt || booking.bookingDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {booking.serviceType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {booking.timeSlot}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${booking.bookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}
                    ${booking.bookingStatus === 'Completed' ? 'bg-blue-100 text-blue-800' : ''}
                    ${booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {booking.bookingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {booking.bookingStatus === 'Pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        disabled={isCanceling}
                        className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {isCanceling ? 'Canceling...' : 'Cancel'}
                      </button>
                    )}
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstBooking + 1}</span> to <span className="font-medium">{Math.min(indexOfLastBooking, filteredBookings.length)}</span> of{' '}
            <span className="font-medium">{filteredBookings.length}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => setCurrentPage(number + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === number + 1 ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserBookingList;
