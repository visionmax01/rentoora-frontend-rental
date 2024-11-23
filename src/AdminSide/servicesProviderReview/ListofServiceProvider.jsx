import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Api from "../../utils/Api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
const ListofServiceProvider = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setIsLoadingAction] =useState(false);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await Api.get("/admin/provider/all-service-providers");
        if (Array.isArray(response.data)) {
          setServiceProviders(response.data);
          setFilteredProviders(response.data); // Initially show all providers
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (error) {
        toast.error(`Failed to fetch service providers: ${error.message}`);
      }
    };

    fetchServiceProviders();
  }, []);

  const handleUpdate = async () => {
    setIsLoadingAction(true);
    if (!selectedProvider) return;

    try {
      const response = await fetch(
        `https://rentoora-backend-rental.vercel.app/Api/admin/provider/service-providers/${selectedProvider._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            availability: selectedProvider.availability,
            verified: selectedProvider.verified,
            status: selectedProvider.status,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update service provider");

      const updatedProvider = await response.json();
      setServiceProviders((prev) =>
        prev.map((provider) =>
          provider._id === updatedProvider._id ? updatedProvider : provider
        )
      );
      toast.success("Service provider updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowUpdateModal(false);
      setSelectedProvider(null);
      setIsLoadingAction(false);
    }
  };

  const handleView = (provider) => {
    setSelectedProvider(provider);
    setShowViewModal(true);
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      // Only trigger search on Enter key press
      setLoading(true); // Show loader
      const searchQuery = e.target.value.toLowerCase();
      setSearchTerm(searchQuery);

      // Filter providers based on accountId or phoneNo
      const filtered = serviceProviders.filter((provider) => {
        return (
          provider.accountId.toLowerCase().includes(searchQuery) ||
          provider.phoneNo.toLowerCase().includes(searchQuery)
        );
      });

      setFilteredProviders(filtered);
      setLoading(false); // Hide loader after search is complete
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true); 
    setSearchTerm(""); 
    setFilteredProviders(serviceProviders); 
    setTimeout(() => {
      setIsRefreshing(false); 
    }, 500); 
  };
  

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const date = new Date(dateString);
    return date.toLocaleString("en-US", options).replace(",", ",");
  };

  return (
    <div className="lg:p-4 pt-4">
      <h1 className="lg:text-2xl text-center text-white sm:text-left font-bold mb-4">
        All Listed Service Providers!
      </h1>
      <div className="flex justify-between mb-4 sm:px-0 px-4">
        <div className="w-full flex justify-between">
          <div className="bg-blue-700 rounded flex items-center">
            <i className="fa-solid fa-magnifying-glass px-3 text-white"></i>
            <input
              type="text"
              placeholder="Account ID or Phone Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="border-2 outline-none p-2 md:w-[250px] focus:border-blue-700"
            />
          </div>

          <button
            onClick={handleRefresh}
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
      </div>

      {/* Loader for search */}
      {loading && (
        <div className="text-center py-4">
          <span className="text-lg">Searching...</span>
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent text-blue-500 mt-2"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Table with responsive design */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border-gray-300 border shadow-md">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="py-2 px-4 border-b text-center">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Verified</th>
              <th className="py-2 px-4 border-b">Availability</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No service providers found.
                </td>
              </tr>
            ) : (
              filteredProviders.map((provider, index) => (
                <tr key={provider._id} 
                className="hover:bg-gray-100 bg-yellow-50">
                  <td className="border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{provider.name}</td>
                  <td className="py-2 px-4 border-b">{provider.email}</td>
                  <td className="py-2 px-4 border-b">{provider.phoneNo}</td>
                  <td className={`py-2 px-4 border-b  ${provider.status === "Approved" ? "text-green-500" :provider.status=== 'Under Review' ? "text-yellow-600" :"text-red-500"}`}>{provider.status}</td>
                  <td className={`py-2 px-4 border-b  ${provider.verified  ? 'text-green-600' : 'text-red-600'}`}>
                    {provider.verified ? "Yes" : "No"}
                  </td>
                  <td className={`py-2 px-4 border-b ${provider.availability === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                    {provider.availability}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowUpdateModal(true);
                      }}
                      className="bg-blue-500 text-white px-2 rounded mr-2"
                    >
                      Action
                    </button>
                    <button
                      onClick={() => handleView(provider)}
                      className="text-blue-500 hover:underline rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Update Modal */}
      {showUpdateModal && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-content lg:w-1/4 relative bg-white rounded-lg shadow-lg p-6 z-10">
            <h2 className="text-xl font-semibold mb-4">Update Provider</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <label className="block mb-4">
                Status:
                <select
                  value={selectedProvider.status}
                  onChange={(e) =>
                    setSelectedProvider({
                      ...selectedProvider,
                      status: e.target.value,
                    })
                  }
                  className="border rounded w-full p-2"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Modification Required">
                    Modification Required
                  </option>
                </select>
              </label>
              <label className="block mb-4  bg-gray-200 py-2 pl-1 rounded">
                Verified:
                <input
                  type="checkbox"
                  checked={selectedProvider.verified}
                  onChange={() =>
                    setSelectedProvider({
                      ...selectedProvider,
                      verified: !selectedProvider.verified,
                    })
                  }
                  className="ml-2"
                />
              </label>
              <label className="block mb-4">
                Availability:
                <select
                  value={selectedProvider.availability}
                  onChange={(e) =>
                    setSelectedProvider({
                      ...selectedProvider,
                      availability: e.target.value,
                    })
                  }
                  className="border rounded w-full p-2"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </label>
              <div className="flex justify-between">
                <button
                  type="submit"
                  disabled= {actionLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                {actionLoading ?(
                  <>
                    Assigning....
                  </>
                ):(
                  "Assigned"
                )} 
                </button>

                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-300 absolute top-2 right-2 text-red-600 hover:text-red-300 px-4 py-2 rounded"
                >
                  X
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-content w-full max-w-4xl bg-white relative rounded-lg shadow-lg p-6 z-10">
            <h2 className="text-xl font-semibold mb-4">
              Service Provider Details
            </h2>
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/2">
                <table className="min-w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Register As:
                      </td>
                      <td className="py-2 px-4 font-extrabold">
                        {selectedProvider.servicesType}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Name:
                      </td>
                      <td className="py-2 px-4">
                        {selectedProvider.name} -{" "}
                        <span className="italic">
                          Account ID: {selectedProvider.accountId}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Email:
                      </td>
                      <td className="py-2 px-4">{selectedProvider.email}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Phone:
                      </td>
                      <td className="py-2 px-4">{selectedProvider.phoneNo}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Experience:
                      </td>
                      <td className="py-2 px-4">
                        {selectedProvider.experience} years
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Exam Result:
                      </td>
                      <td className="py-2 px-4">
                        {selectedProvider.examResults}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Working Time:
                      </td>
                      <td className="py-2 px-4">
                        {selectedProvider.workingFrom} to{" "}
                        {selectedProvider.workingTo}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Created At:
                      </td>
                      <td className="py-2 px-4">
                        {formatDate(selectedProvider.createdAt)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold text-gray-700">
                        Updated At:
                      </td>
                      <td className="py-2 px-4">
                        {formatDate(selectedProvider.updatedAt)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-full lg:w-1/2">
              <h1 className="font-bold">Uploaded Certificate.</h1>
                {selectedProvider.certificates && (
                  <div className="relative group w-[400px]">
                    <img
                      src={selectedProvider.certificates}
                      alt="Certificate"
                      className="mt-2 rounded border w-[400px] h-[350px] cursor-pointer"
                      onClick={() => setShowImagePreview(true)}
                    />
                    <button
                      onClick={() => setShowImagePreview(true)}
                      className="absolute bottom-0 w-full bg-blue-500 text-white px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      click to view Image
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setShowUpdateModal(true);
              }}
              className="bg-blue-500 text-white  hover:bg-blue-600 select-none px-6 mt-2 py-2  rounded mr-2"
            >
              Take Action
            </button>
            <button
              onClick={() => setShowViewModal(false)}
              className="bg-gray-300 absolute top-2 right-2 text-red-600 hover:text-red-300 px-4 py-2 rounded"
            >
              X
            </button>
          </div>
        </div>
      )}
     <div>
      {/* Image Preview Modal */}
      {showImagePreview && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="relative">
            <img
              src={selectedProvider.certificates}
              alt="Full Screen Certificate"
              className="max-w-full h-[600px]"
            />
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2"
            >
              X
            </button>
          </div>
        </div>
      )}
     </div>
    </div>
  );
};

export default ListofServiceProvider;
