import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";
import AdminNav from "./adminNav";
import { toast } from "react-hot-toast"; 
import UpdateClient from "./UpdateClient"; 


const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false); 
  const [clientToDelete, setClientToDelete] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "https://rentoora-backend-rental.onrender.com/admin/all-clients",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setClients(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching clients");
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowPopup(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setShowDeletePopup(true); // Show delete confirmation popup
  };

  const confirmDeleteClient = async () => {
    try {
      await axios.delete(
        `https://rentoora-backend-rental.onrender.com/admin/delete-client/${clientToDelete.accountId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClients(
        clients.filter(
          (client) => client.accountId !== clientToDelete.accountId
        )
      );
      setShowDeletePopup(false);
      setClientToDelete(null);
      toast.success("Client & Associated Document deleted successfully!"); 
    } catch (err) {
      setError("Error deleting client");
      setShowDeletePopup(false);
    }
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setClientToDelete(null);
  };

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

 // Filter clients based on search term
const filteredClients = clients.filter((client) => {
  const clientName = client.name.toLowerCase(); // Convert name to lowercase
  const clientId = client.accountId.toString().toLowerCase(); // Convert account ID to lowercase string

  return (
    clientName.includes(searchTerm.toLowerCase()) || // Check if name includes search term
    clientId.includes(searchTerm.toLowerCase()) // Check if account ID includes search term
  );
});

  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditClick = (client) => {
    setSelectedClient(client); // Set the selected client for editing
    setShowEditPopup(true); // Open the edit popup
  };

  return (
    <div className="min-h-screen  bg-gray-100 md:p-8   ">
      <AdminNav />
      <div className="container mx-auto  w-[100%]">
        <div className="flex md:flex-row flex-col justify-between items-center md:w-full ">
          <h2 className="text-2xl font-bold mb-4 text-brand-bgColor">Available Client's</h2>
          {/* Search Input */}
          <div className="mb-4 flex justify-end items-center  ">
            <div className="bg-blue-700 rounded flex items-center">
              <i className="fa-solid fa-magnifying-glass px-3 text-white"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 outline-none p-2 md:w-[250px] focus:border-blue-700"
                placeholder="Search by Account ID"
              />
            </div>
          </div>
        </div>


{/* Large Device View - Hidden on Small Devices */}
<div className="overflow-x-auto hidden sm:block">
  <table className="w-full border border-gray-300 p-4">
    <thead className="w-fit">
      <tr className="bg-gray-200  text-left">
        <th className="py-2 px-4 border-b">#</th>
        <th className="py-2 px-4 border-b">Profile Pic</th>
        <th className="py-2 px-4 border-b">Name</th>
        <th className="py-2 px-4 border-b">Email</th>
        <th className="py-2 px-4 border-b">Phone No</th>
        <th className="py-2 px-4 border-b">Address</th>
        <th className="py-2 px-4 border-b">Account ID</th>
        <th className="py-2 px-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody className="w-fit ">
      {currentClients.map((client, index) => (
        <tr key={client.accountId} className="hover:bg-gray-100">
          <td className="py-2 px-4 border-b">
            {index + 1 + indexOfFirstClient}
          </td>
          <td className="py-2 px-4 border-b">
            <img
              className="rounded-full w-6 h-6"
              src={client.profilePhotoPath}
              alt="Profile"
            />
          </td>
          <td className="py-2 px-4 border-b">{client.name}</td>
          <td className="py-2 px-4 border-b">{client.email}</td>
          <td className="py-2 px-4 border-b">{client.phoneNo}</td>
          <td className="py-2 px-4 border-b">{client.province}, {client.district}, {client.municipality}</td>
          <td className="py-2 px-4 border-b">{client.accountId}</td>
          <td className="py-2 px-4 border-b">
            <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleViewDetails(client)}>
              <FaEye />
            </button>
            <button className="text-green-500 hover:text-green-700 mr-2" onClick={() => handleEditClick(client)}>
              <FaEdit />
            </button>
            <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(client)}>
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Small Device View - Hidden on Large Devices */}
<div className="overflow-x-auto sm:hidden">
  <table className="min-w-full bg-white border  border-gray-300">
    <thead className="w-full">
      <tr className="bg-gray-200 text-gray-700 text-left">
        <th className="px-2 py-3 text-[15.2px] border-b">#</th>
        <th className="px-2 py-3 text-[15.2px] border-b">Pic</th>
        <th className="px-2 py-3 text-[15.2px] border-b">Name</th>
        <th className="px-2 py-3 text-[15.2px] border-b">Account ID</th>
        <th className="px-2 py-3 text-[15.2px] border-b">Actions</th>
      </tr>
    </thead>
    <tbody className="w-full">
      {currentClients.map((client, index) => (
        <tr key={client.accountId} className="hover:bg-gray-100">
          <td className="px-2 py-3 text-[15.2px] border-b">
            {index + 1 + indexOfFirstClient}
          </td>
          <td className="px-2 py-3 text-[15.2px] border-b">
            <img className="rounded-full w-6 h-6" src={client.profilePhotoPath} alt="Profile" />
          </td>
          <td className="px-2 py-3 text-[15.2px] border-b">{client.name}</td>
          <td className="px-2 py-3 text-[15.2px] border-b">{client.accountId}</td>
          <td className="px-2 py-3 text-[15.2px] border-b">
            <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleViewDetails(client)}>
              <FaEye />
            </button>
            <button className="text-green-500 hover:text-green-700 mr-2" onClick={() => handleEditClick(client)}>
              <FaEdit />
            </button>
            <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(client)}>
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* Pagination */}
        <div className="flex justify-between mt-4 lg:px-0 px-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2  ">
          <div className="bg-white lg:p-6 p-2 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 flex flex-col justify-center items-center">
              <i className="fa-solid fa-question bg-green-500 p-2 w-8 h-8 text-white rounded-full"></i>
              <p className="text-gray-400">Are you sure want to delete </p>
              <p className="text-gray-950 capitalize font-bold text-2xl underline-offset-auto">
                {clientToDelete.name}?
              </p>
            </h3>
            <div className="flex justify-center ">
              <button
                onClick={confirmDeleteClient}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Delete
              </button>
              <button
                onClick={closeDeletePopup}
                className="bg-gray-300  text-gray-700 px-4 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Client Popup */}
      {showEditPopup && (
        <UpdateClient
          client={selectedClient}
          onClose={() => setShowEditPopup(false)}
        />
      )}

      {/* View Client Details Popup */}
      {showPopup && selectedClient && (
        <div className="fixed  inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="relative bg-white p-6 rounded-lg shadow-lg  lg:w-1/2 mx-2">
            <h3 className="text-xl mb-4">
              Detail's of -{" "}
              <span className="font-bold uppercase">{selectedClient.name}</span>
            </h3>
            <div className="flex gap-8 mb-3">
            <div className=" text-center w-fit bg-gray-200 rounded">
              <img
                className="rounded w-32 lg:h-32 h-24 "
                src={selectedClient.profilePhotoPath}
                alt="No Profile pic"
              />
              <p className="font-bold text-gray-400  uppercase">profile Pic</p>
              
            </div>

            <div className="text-center w-fit rounded bg-gray-200 p-2">
              <img
                className="rounded w-44 lg:h-32 h-24 "
                src={selectedClient.citizenshipImagePath}
                alt="No image Available"
              />
              <p className="font-bold text-gray-400  uppercase">Citizenship </p>
              
            </div>
            </div>
            
            <table className="w-full table-auto border-collapse border border-gray-300">
              <tbody>
              <tr>
                  <td className="font-bold pr-4 border border-gray-200 py-2 pl-2">
                    Account ID:
                  </td>
                  <td className="border border-gray-200 py-2 pl-2 ">
                    {selectedClient.accountId}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 border border-gray-200 py-2 pl-2">
                    Email:
                  </td>
                  <td className="border border-gray-200 py-2 pl-2 ">
                    {selectedClient.email}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 border border-gray-200 py-2 pl-2">
                    Phone No:
                  </td>
                  <td className="border border-gray-200 pl-2 py-2">
                    {selectedClient.phoneNo}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 border border-gray-200 py-2 pl-2">
                    Address:
                  </td>
                  <td className="border border-gray-200 py-2 pl-2 ">
                    {selectedClient.province}, {selectedClient.district}, {selectedClient.municipality}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 border border-gray-200 py-2 pl-2">
                    Date of Birth:
                  </td>
                  <td className="border border-gray-200 py-2 pl-2 ">
                    {new Date(selectedClient.dateOfBirth).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                </tr>

                
              </tbody>
            </table>
            <div className="absolute top-0 right-0 ">
              <button
                onClick={() => setShowPopup(false)}
                className="  px-3 py-2 font-bold bg-gray-700 text-gray-200 hover:text-red-300 rounded-tr-lg "
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

export default ClientsTable;
