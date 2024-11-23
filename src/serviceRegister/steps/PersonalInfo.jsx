import React, { useEffect, useState } from 'react';
import Api from '../../utils/aPI.JS'; 
import { locationData } from '../../utils/LocationData.jsx'; 
import Select from 'react-select';

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
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);

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

  useEffect(() => {
    const provinces = locationData.map(province => ({
      value: province.name,
      label: province.name
    }));
    setProvinceOptions(provinces);
  }, []);

  useEffect(() => {
    if (newAddress.province) {
      const province = locationData.find(p => p.name === newAddress.province);
      if (province) {
        const districts = province.districts.map(district => ({
          value: district.name,
          label: district.name
        }));
        setDistrictOptions(districts);
      }
    } else {
      setDistrictOptions([]);
    }
  }, [newAddress.province]);

  useEffect(() => {
    if (newAddress.province && newAddress.district) {
      const province = locationData.find(p => p.name === newAddress.province);
      const district = province?.districts.find(d => d.name === newAddress.district);
      if (district) {
        const allMunicipalities = district.municipalities.map(municipality => ({
          value: municipality,
          label: municipality
        }));
        setMunicipalityOptions(allMunicipalities);
      }
    } else {
      setMunicipalityOptions([]);
    }
  }, [newAddress.province, newAddress.district]);

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
          <div className="lg:h-[380px] h-[600px] overflow-y-auto pr-4">
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
              <h3 className="text-lg font-bold mb-4">Add New Address</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={provinceOptions.find(option => option.value === newAddress.province)}
                    options={provinceOptions}
                    onChange={(option) => setNewAddress({ ...newAddress, province: option.value, district: '', municipality: '' })}
                    placeholder="Select Province"
                    isSearchable={true}
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={districtOptions.find(option => option.value === newAddress.district)}
                    options={districtOptions}
                    onChange={(option) => setNewAddress({ ...newAddress, district: option.value, municipality: '' })}
                    placeholder="Select District"
                    isSearchable={true}
                    isDisabled={!newAddress.province}
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Municipality <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={municipalityOptions.find(option => option.value === newAddress.municipality)}
                    options={municipalityOptions}
                    onChange={(option) => setNewAddress({ ...newAddress, municipality: option.value })}
                    placeholder="Select Municipality"
                    isSearchable={true}
                    isDisabled={!newAddress.district}
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleAddAddress} 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Address
                </button>
                <button 
                  onClick={() => setShowAddAddressPopup(false)} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
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
