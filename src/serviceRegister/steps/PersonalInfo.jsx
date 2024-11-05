import React, { useEffect, useState } from 'react';
import Api from '../../utils/aPI.JS'; 
import { locationData } from '../../utils/locationData'; 

const PersonalInfo = ({ formData, handleChange, handleNext, handlePrev }) => { 
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({
    province: '',
    district: '',
    municipality: '',
  });
  const [savedNewAddress, setSavedNewAddress] = useState('');
  const [addressChoice, setAddressChoice] = useState('current');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get('auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
        setAddress(`${response.data.province}, ${response.data.district}, ${response.data.municipality}`);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddAddress = () => {
    const formattedAddress = `${newAddress.province}, ${newAddress.district}, ${newAddress.municipality}`;
    setSavedNewAddress(formattedAddress);
    setShowAddAddressPopup(false);
    handleChange({ address: formattedAddress }); // Update form data with the new address
  };

  const validateFields = () => {
   
    if (addressChoice === 'new' && !savedNewAddress) {
      setError('Please save your new address before proceeding.');
      return false;
    }
    
    handleChange({
      address: addressChoice === 'current' ? address : savedNewAddress,
    }); // Update formData
    setError('');
    return true;
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="mb-4 ">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="h-[380px] overflow-y-auto pr-4">
          <div className="mb-4">
            <p>Name : <strong>{user.name}</strong></p>
            <p>Email : <strong>{user.email}</strong></p>
            <p>Phone No : <strong>{user.phoneNo}</strong></p>
            <p>Account Id: <strong>{user.accountId}</strong></p>
          </div>
          <h2 className="text-xl font-bold mb-4">Address Information</h2>
          <div className="mb-4">
            <p className="text-lg">Current Address:</p>
            <label>
              <input
                type="radio"
                name="address"
                value="current"
                checked={addressChoice === "current"}
                onChange={() => setAddressChoice("current")}
              />
              {address}
            </label>
          </div>
          {savedNewAddress && (
            <div className="mb-4">
              <p className="text-lg">New Address:</p>
              <label>
                <input
                  type="radio"
                  name="address"
                  value="new"
                  checked={addressChoice === "new"}
                  onChange={() => setAddressChoice("new")}
                />
                {savedNewAddress}
              </label>
            </div>
          )}
          <button
            onClick={() => setShowAddAddressPopup(true)}
            className="bg-yellow-600  text-white px-4 py-2 rounded"
          >
            Add New Address
          </button>
          {showAddAddressPopup && (
            <div className="popup py-3">
              <h3 className="text-lg font-bold">Add New Address</h3>
              <div className="flex flex-wrap gap-6 ">
                <select
                  name="province"
                  value={newAddress.province}
                  className='p-2 rounded'
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                >
                  <option value="">Select Province</option>
                  {locationData.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <select
                  name="district"
                  value={newAddress.district}
                  className='p-2 rounded'
                  onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                >
                  <option value="">Select District</option>
                  {newAddress.province && locationData.find(p => p.name === newAddress.province).districts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                <select
                  name="municipality"
                  value={newAddress.municipality}
                  className='p-2 rounded'
                  onChange={(e) => setNewAddress({ ...newAddress, municipality: e.target.value })}
                >
                  <option value="">Select Municipality</option>
                  {newAddress.district && locationData.find(p => p.name === newAddress.province).districts.find(d => d.name === newAddress.district).municipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>
                      {municipality}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddAddress} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                Save Address
              </button>
              <button onClick={() => setShowAddAddressPopup(false)} className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2">
                Cancel
              </button>
            </div>
          )}
          
      
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="absolute bottom-2 right-6 flex gap-12 mt-4">
            <button onClick={handlePrev} className="btn bg-gray-400 px-6 py-2 rounded hover:bg-gray-500">Previous</button>
            <button 
              onClick={() => { 
                if (validateFields()) handleNext(); 
              }} 
              className="btn bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
