import React, { useState, useEffect } from "react";
import Api from "../utils/Api.js";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faTicketAlt, faPaperPlane, faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

const ServicesSupport = () => {
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const token = localStorage.getItem("token");
  const [expandedTicket, setExpandedTicket] = useState(null);

  const toggleTicketDetails = (ticketId) => {
    setExpandedTicket((prevState) =>
      prevState === ticketId ? null : ticketId
    );
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await Api.get("txt/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort tickets by date in descending order
      const sortedTickets = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTickets(sortedTickets || []);
    } catch (error) {
      console.error(
        "Error fetching tickets:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!issueType || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await Api.post(
        "txt/create",
        { issueType, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Ticket created successfully.");
      setTickets([res.data.ticket, ...tickets]);
      setIssueType("");
      setMessage("");
    } catch (error) {
      console.error(
        "Error creating ticket:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response?.data?.error || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };

  const openUpdateModal = (ticket) => {
    setEditingTicket(ticket);
    setMessage(ticket.message);
    setShowUpdateModal(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!editingTicket || !message) return;

    setLoading(true);
    try {
      const res = await Api.put(
        `txt/tickets/${editingTicket._id}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Message Updated successfully.");
      setTickets(
        tickets.map((ticket) =>
          ticket._id === editingTicket._id
            ? { ...ticket, message: res.data.ticket.message }
            : ticket
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error(
        "Error updating ticket:",
        error.response ? error.response.data : error.message
      );
      toast.error("Can't Send message Ticket is Closed or Deleted !");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setLoading(true);
    try {
      await Api.delete(`txt/tickets/${ticketToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ticket deleted successfully.");
      setTickets(tickets.filter((ticket) => ticket._id !== ticketToDelete._id));
      setShowDeleteModal(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error(
        "Error deleting ticket:",
        error.response ? error.response.data : error.message
      );
      toast.error("Can't Delete Ticket state is OPEN or ON HOLD .");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteModal(true);
  };

  // Group tickets by date
  const groupTicketsByDate = () => {
    const grouped = {};
    tickets.forEach(ticket => {
      const date = new Date(ticket.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(ticket);
    });
    return grouped;
  };

  const groupedTickets = groupTicketsByDate();

  return (
    <div className="container  mx-auto lg:p-4 ">
      <h1 className="lg:text-4xl text-2xl font-extrabold text-center mb-10 text-indigo-800 tracking-wide">Support Services</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Create Ticket Form */}
        <form onSubmit={handleCreateTicket} className="lg:w-1/2 w-full bg-gradient-to-br from-purple-100 to-indigo-200 p-6 rounded-xl shadow-lg transform transition-all duration-300 ">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Create New Ticket</h2>
          <div className="mb-6">
            <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
            <select
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-800"
            >
              <option value="">Select an issue type</option>
              <option value="software related issue">Software Related Issue</option>
              <option value="sales related issue">Sales Related Issue</option>
              <option value="post related issue">Post Related Issue</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Describe Your Issue:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 h-32 resize-none text-gray-800"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Ticket"
            )}
          </button>
        </form>

        {/* Tickets List */}
        <div className="lg:w-1/2 w-full bg-gradient-to-br from-purple-100 to-indigo-200 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Your Tickets</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-4 h-80 overflow-y-auto lg:pr-8">
              {Object.keys(groupedTickets).length === 0 ? (
                <p className="text-center text-gray-500 italic">No tickets found.</p>
              ) : (
                Object.entries(groupedTickets).map(([date, dateTickets]) => (
                  <div key={date} className="mb-6">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">{date}</h3>
                    {dateTickets.map((ticket) => (
                      <div
                        key={ticket._id}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl mb-4"
                      >
                        <div
                          onClick={() => toggleTicketDetails(ticket._id)}
                          className="bg-indigo-600 py-3 px-4 text-white flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-semibold">Ticket No: {ticket.ticketNumber}</span>
                          <FontAwesomeIcon
                            icon={expandedTicket === ticket._id ? faChevronUp : faChevronDown}
                            className="text-white transition-transform duration-300"
                          />
                        </div>

                        {expandedTicket === ticket._id && (
                          <div className="p-4 space-y-2">
                            <p><strong className="text-indigo-700">Issue Type:</strong> <span className="text-gray-600">{ticket.issueType}</span></p>
                            <p><strong className="text-indigo-700">Date Created:</strong> <span className="text-gray-600">{new Date(ticket.createdAt).toLocaleString()}</span></p>
                            <p><strong className="text-indigo-700">Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ticket.status === 'OPEN' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{ticket.status}</span></p>
                            <button
                              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                              onClick={() => openDetailModal(ticket)}
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 z-50   bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Ticket Details</h2>
            <div className="space-y-3">
              <p><strong className="text-indigo-600">Ticket No:</strong> <span className="text-gray-600">{selectedTicket.ticketNumber}</span></p>
              <p><strong className="text-indigo-600">Issue Type:</strong> <span className="text-gray-600">{selectedTicket.issueType}</span></p>
              <div>
                <strong className="text-indigo-600">Message:</strong>
                <p className="mt-1 p-2 bg-gray-100 rounded text-gray-600">{selectedTicket.message}</p>
              </div>
              <div>
                <strong className="text-indigo-600">Reply:</strong>
                <p className="mt-1 p-2 bg-gray-100 rounded text-gray-600">{selectedTicket.supportReply || "No reply yet."}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                onClick={() => openUpdateModal(selectedTicket)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                onClick={() => openDeleteModal(selectedTicket)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && editingTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Edit Ticket</h2>
            <form onSubmit={handleUpdateTicket}>
              <div className="mb-4">
                <label htmlFor="updateMessage" className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
                <textarea
                  id="updateMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 h-32 resize-none text-gray-800"
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && ticketToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Ticket</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                onClick={handleDeleteTicket}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
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
