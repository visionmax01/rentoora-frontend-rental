import React, { useState, useEffect } from 'react';
import Api from '../utils/Api.js';  

const Step1 = ({ formData, setFormData, handleNextStep }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);  
  const [addressSelected, setAddressSelected] = useState(false);  

  // Fetch user data from API on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get("auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data); 
        const address = `${response.data.province}, ${response.data.district}, ${response.data.municipality}`;

        setFormData({
          ...formData,
          name: response.data.name,
          phoneNo: response.data.phoneNo,
          address: address, 
          accountId: response.data.accountId,
        });

        setAddressSelected(true); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUserData();
  }, [setFormData]); 

  // Handle the address radio button selection
  const handleAddressSelection = () => {
    setAddressSelected(!addressSelected);  
    if (!addressSelected) {
      // If checked, set the form data with the selected address
      setFormData((prevData) => ({ ...prevData, address: `${user?.province}, ${user?.district}, ${user?.municipality}` }));
    } else {
      // If unchecked, clear the address
      setFormData((prevData) => ({ ...prevData, address: '' }));
    }
  };

  // If the user data is still loading, display a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-1/2 mt-16 ">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    
    <div className='px-4 sm:px-6 lg:px-8 py-6'>
      <h3 className="text-2xl font-bold mb-6 text-indigo-700">Step 1: Your Information</h3>
      <div className=" p-6 w-full max-w-2xl  bg-white shadow-lg rounded-lg relative">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 w-28 mb-2 sm:mb-0">Name:</label>
            <input
              type="text"
              disabled
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="flex-grow mt-1 block w-full px-2 border-gray-300 rounded shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 w-28 mb-2 sm:mb-0">Account No:</label>
            <input
              type="text"
              disabled
              value={formData.accountId || ''}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="flex-grow mt-1 block w-full px-2 border-gray-300 rounded shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 w-28 mb-2 sm:mb-0">Phone No:</label>
            <input
              type="text"
              disabled
              value={formData.phoneNo || ''}
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
              className="flex-grow mt-1 block w-full px-2 border-gray-300 rounded shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-lg text-gray-800 mb-3">Address:</h4>
            <div className="flex items-center bg-gray-50 p-4 rounded-md">
              <input
                type="radio"
                id="user-address"
                name="address"
                value={formData.address}
                checked={addressSelected}
                onChange={handleAddressSelection}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="user-address" className="ml-3 block text-sm font-medium text-gray-700">
                {formData.address || 'No address available'}
              </label>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
        <button 
          onClick={handleNextStep}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none  transition-colors duration-200"
        >
          Next
        </button>
      </div>
      </div>
      

    </div>
  );
};

export default Step1;
