import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Api from '../../utils/Api.js';

const ListofServiceProvider = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await Api.get('/admin/provider/all-service-providers');
        if (Array.isArray(response.data)) {
          setServiceProviders(response.data);
          toast.success('Service providers loaded successfully!');
        } else {
          throw new Error('Fetched data is not an array');
        }
      } catch (error) {
        toast.error(`Failed to fetch service providers: ${error.message}`);
      }
    };

    fetchServiceProviders();
  }, []);

  const handleUpdate = async () => {
    // Update logic...
  };

  const handleView = (provider) => {
    setSelectedProvider(provider);
    setShowViewModal(true);
  };

  return (
    <div className="p-4">
      {/* Service Providers Table... */}
      
      {/* View Modal */}
      {showViewModal && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-content bg-white rounded-lg shadow-lg p-6 z-10 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Service Provider Details</h2>
            <table className="min-w-full border-collapse">
              <tbody>
                {/* Other rows... */}
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold text-gray-700">Certificate:</td>
                  <td className="py-2 px-4">
                    {selectedProvider.certificates && (
                      <div>
                        <img
                          src={selectedProvider.certificates}
                          alt="Certificate"
                          className="mt-2 rounded border w-full h-[250px] cursor-pointer"
                          onClick={() => setShowImagePreview(true)} // Set state to show image preview
                        />
                        <button 
                          onClick={() => setShowImagePreview(true)} 
                          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Preview
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {/* More fields... */}
              </tbody>
            </table>
            <button onClick={() => setShowViewModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded mt-4">Close</button>
          </div>
        </div>
      )}

      {/* Full-Screen Image Preview */}
      {showImagePreview && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="relative">
            <img 
              src={selectedProvider.certificates} 
              alt="Full Screen Certificate" 
              className="max-w-full max-h-full"
            />
            <button 
              onClick={() => setShowImagePreview(false)} 
              className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListofServiceProvider;
