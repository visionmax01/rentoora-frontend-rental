import React, { useEffect, useState } from "react";
import Api from "../utils/Api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import {toast} from 'react-toastify'
 
const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await Api.get("admin/support-tickets");
      const sortedTickets = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTickets(sortedTickets);
      setFilteredTickets(sortedTickets);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setIsSearching(true);
      try {
        const response = await Api.get(`admin/search?query=${searchTerm}`);
        setFilteredTickets(response.data);
        if (response.data.length === 0) {
          alert("No support ticket found");
        }
      } catch (error) {
        console.error("Error during search", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const refreshTickets = async () => {
    setIsRefreshing(true);
    await fetchTickets();

    setTimeout (()=>{
      setIsRefreshing(false);

    }, 500)
  };

  const openPopup = (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
    setStatus(ticket.status);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedTicket(null);
    setIsPopupOpen(false);
  };

  const handleReply = async () => {
    setIsLoading(true);
    try {
      await Api.post(`admin/support-tickets/${selectedTicket._id}/reply`, {
        replyMessage,
        status,
      });
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === selectedTicket._id
            ? { ...ticket, supportReply: replyMessage, status: status }
            : ticket
        )
      );
      setSelectedTicket((prev) => ({
        ...prev,
        supportReply: replyMessage,
        status: status,
      }));
      setReplyMessage("");
      toast.success('Reply Sended Successfully !')
    } catch (error) {
      console.error("Error sending reply", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isNewTicket = (createdAt) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return new Date(createdAt) >= twoDaysAgo;
  };

  const refreshTicketDetails = async () => {
    if (selectedTicket) {
      try {
        const updatedTicket = await Api.get(
          `admin/support-tickets/${selectedTicket._id}`
        );
        setSelectedTicket(updatedTicket.data);
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === updatedTicket.data._id ? updatedTicket.data : ticket
          )
        );
      } catch (error) {
        console.error("Error fetching ticket details", error);
      }
    }
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const date = new Date(dateString);
    return date.toLocaleString("en-US", options).replace(",", ",");
  };
  useEffect(() => {
    let interval;
    if (isPopupOpen) {
      interval = setInterval(refreshTicketDetails, 1000);
    }
    return () => clearInterval(interval);
  }, [isPopupOpen, selectedTicket]);

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-white my-4  sm:text-left text-center">
        All Available Support Tickets!
      </h1>

      <div className="flex  justify-between mb-4 sm:px-0 px-4">
        <div className="bg-blue-700 rounded flex items-center">
          <i className="fa-solid fa-magnifying-glass px-3 text-white"></i>
          <input
            type="text"
            placeholder="Search Tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="border-2 outline-none p-2 md:w-[250px] focus:border-blue-700"
          />
        </div>

        <button
          onClick={refreshTickets}
          className={`ml-2 bg-blue-500 text-white rounded-md p-2 flex items-center ${
            isRefreshing ? "opacity-50" : ""
          }`}
          disabled={isRefreshing}
        >
          <FontAwesomeIcon
            icon={faSync}
            className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:block">
            {isRefreshing ? "Refreshing" : "Refresh"}
          </span>
        </button>
      </div>

      {isSearching && <div className="text-center mb-4">Loading...</div>}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Ticket Number</th>
              <th className="py-2 px-4 border-b">Client Name</th>
              <th className="py-2 px-4 border-b">AccountNo</th>
              <th className="py-2 px-4 border-b">Issue Type</th>
              <th className="py-2 px-4 border-b">Ticket Rised ON</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket.ticketNumber}
                  className={`hover:bg-gray-100 text-left ${
                    isNewTicket(ticket.createdAt) ? "bg-yellow-50" : ""
                  }`}
                >
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{ticket.ticketNumber}</td>
                  <td className="py-2 px-4 border-b">{ticket.clientId.name}</td>
                  <td className="py-2 px-4 border-b">{ticket.clientId.accountId}</td>
                  <td className="py-2 px-4 border-b">{ticket.issueType}</td>
                  <td className="py-2 px-4 border-b"> {formatDate(ticket.createdAt)}</td>
                  <td
                    className={`py-2 px-4 border-b ${
                      ticket.status === "Open"
                        ? "text-green-500 font-bold"
                        : ticket.status === "On Hold"
                        ? "text-blue-500 font-bold"
                        : "text-red-500 font-bold"
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openPopup(ticket)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPopupOpen && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white relative rounded-lg shadow-lg p-6 w-11/12 sm:w-1/3">
            <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
            <p>
              <strong>Ticket Number:</strong> {selectedTicket.ticketNumber}
            </p>
            <p>
              <strong>Client:</strong> {selectedTicket.clientId.name} (
              {selectedTicket.clientId.email})
            </p>
            <p>
              <strong>Issue Type:</strong> {selectedTicket.issueType}
            </p>
            <p>
              <strong>Status:</strong> {selectedTicket.status}
            </p>
            <p>
              <strong>Message:</strong> {selectedTicket.message}
            </p>
            <p>
              <strong>Support Reply:</strong>{" "}
              {selectedTicket.supportReply || "No reply yet."}
            </p>

            <textarea
              className="mt-4 w-full border border-gray-300 rounded-md p-2"
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Update Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="Open">Open</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReply}
                className={`bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mr-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reply"}
              </button>
              <button
                onClick={closePopup}
                className="bg-gray-300 absolute top-2 right-2 text-red-600 hover:text-red-300 px-4 py-2 rounded"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
