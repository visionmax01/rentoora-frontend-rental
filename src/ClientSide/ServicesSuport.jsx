import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ServicesSupport = () => {
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null); // Ticket to edit
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Modal for updating
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal for delete confirmation
  const [ticketToDelete, setTicketToDelete] = useState(null); // Ticket to delete
  const [showDetailModal, setShowDetailModal] = useState(false); // Modal for ticket details
  const [selectedTicket, setSelectedTicket] = useState(null); // Selected ticket for detail view
  const token = localStorage.getItem('token');

  // Fetch tickets for the current user
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://rentoora-backend-rental.onrender.com/txt/my-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedTickets = Array.isArray(res.data) ? res.data : [];
      setTickets(fetchedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error.response ? error.response.data : error.message);
      toast.error('Failed to fetch tickets.');
    } finally {
      setLoading(false); // Ensure loading is turned off even on error
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Create a new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!issueType || !message) {
      toast.error('Please fill out all fields.');
      return;
    }

    setLoading(true); // Set loading for the submit button
    try {
      const res = await axios.post(
        'https://rentoora-backend-rental.onrender.com/txt/create',
        { issueType, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Ticket created successfully.');
      setTickets([...tickets, res.data.ticket]);
      setIssueType('');
      setMessage('');
    } catch (error) {
      console.error('Error creating ticket:', error.response ? error.response.data : error.message);
      toast.error('Failed to create ticket.');
    } finally {
      setLoading(false); // Turn off loading
    }
  };

  // Open detail modal
  const openDetailModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };

  // Open update modal and set ticket to edit
  const openUpdateModal = (ticket) => {
    setEditingTicket(ticket);
    setMessage(ticket.message); // Pre-fill with current message
    setShowUpdateModal(true);
  };

  // Update ticket
  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!editingTicket || !message) return;

    setLoading(true); // Set loading for the modal
    try {
      const res = await axios.put(`https://rentoora-backend-rental.onrender.com/txt/update/${editingTicket._id}`, {
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Ticket updated successfully.');
      setTickets(
        tickets.map((ticket) =>
          ticket._id === editingTicket._id ? { ...ticket, message: res.data.ticket.message } : ticket
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating ticket:', error.response ? error.response.data : error.message);
      toast.error('Failed to update ticket.');
    } finally {
      setLoading(false); // Turn off loading
    }
  };

  // Open delete modal and set ticket to delete
  const openDeleteModal = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteModal(true);
  };

  // Delete ticket
  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`https://rentoora-backend-rental.onrender.com/txt/delete/${ticketToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Ticket deleted successfully.');
      setTickets(tickets.filter((ticket) => ticket._id !== ticketToDelete._id));
      setShowDeleteModal(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error('Error deleting ticket:', error.response ? error.response.data : error.message);
      toast.error('Failed to delete ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6  bg-brand-bgColor h-auto">
      <div className="gap-4">

        {/* Create Ticket Form */}
        <form onSubmit={handleCreateTicket} className="mb-8 lg:w-1/2 w-full">
      <h1 className="text-3xl font-bold mb-4 w-full">Support Page</h1>

          <div className="mb-4">
            <label htmlFor="issueType" className="block text-sm font-medium text-gray-300">
              Issue Type
            </label>
            <input
              id="issueType"
              type="text"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="mt-1 p-2 border bg-transparent outline-none focus:border-red-600 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 p-2 border border-gray-300 bg-transparent outline-none focus:border-red-600 rounded w-full"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div className=" lg:w-1/2 w-full  p-4 rounded">
          <h2 className="text-xl font-bold">Your tickets</h2>
          <div className="w-12  h-0.5 bg-blue-500"></div>
          {/* Tickets List */}
          {loading ? (
            <p>Loading tickets...</p>
          ) : (
            <div >
              {tickets.length === 0 ? (
                <p>No tickets found.</p>
              ) : (
                <ul className='flex flex-col gap-12'>
                  {tickets.map((ticket) => (
                    <li key={ticket._id} className="border-2 border-white relative w-72 mt-6 bg-white text-gray-600 rounded p-4 shadow-lg transition-transform transform hover:scale-105">
                      <div className="bg-blue-500 py-1 text-center text-white rounded">
                        <span className="font-bold">Ticket No:</span> {ticket.ticketNumber}
                      </div>
                      <div className="mt-2">
                        <strong>Issue Type:</strong> {ticket.issueType}
                      </div>
                      <div>
                        <strong>Date Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {ticket.status}
                      </div>
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => openDetailModal(ticket)}
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="relative w-3/4 bg-white text-black p-6 rounded-lg lg:w-96">
            <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
            <div>
              <strong>Ticket No:</strong> {selectedTicket.ticketNumber}
            </div>
            <div>
              <strong>Issue Type:</strong> {selectedTicket.issueType}
            </div>
            <div>
              <strong>Message:</strong>
            </div>
            <textarea
              value={selectedTicket.message}
              readOnly
              className="w-full h-24 p-2 border border-gray-300 rounded"
            ></textarea>
            <div className="mt-4 flex justify-between">
              <button
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => openUpdateModal(selectedTicket)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => openDeleteModal(selectedTicket)}
              >
                Delete
              </button>
              <button
                className="px-2 py-1 font-bold absolute  top-0 right-0 text-gray-400 hover:text-black"
                onClick={() => setShowDetailModal(false)}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Ticket Modal */}
      {showUpdateModal && editingTicket && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-3/4 text-black p-6 rounded-lg lg:w-96">
            <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
            <form onSubmit={handleUpdateTicket}>
              <div>
                <strong>Message:</strong>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-24 p-2 border border-gray-300 rounded"
              ></textarea>
              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && ticketToDelete && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-3/4 text-black p-6 rounded-lg lg:w-96">
            <h2 className="text-xl font-bold mb-4">Delete Ticket</h2>
            <p>Are you sure you want to delete this ticket?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDeleteTicket}
              >
                Yes, Delete
              </button>
              <button
                className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesSupport;
