import React, { useEffect, useState } from "react";
import Api from "../utils/Api.js";
import manpng from "../assets/img/man.png";
import {toast} from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { locationData } from "../utils/LocationData";
import ProfilePopup from "../utils/ProfilePopup.jsx";
import { PenBoxIcon, XIcon } from "lucide-react";
import Select from 'react-select';

const ClientProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null); 
  const [citizenshipImagePath, setDocumentePhoto] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phoneNo: "",
    accountId: "",
    province: "",
    district: "",
    municipality: "",
    role: "",
    dateOfBirth: "",
  });
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [provinces, setProvinces] = useState(locationData);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false); // Track if editing personal details
  const [isEditingAddress, setIsEditingAddress] = useState(false); // Track if editing address details
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get("auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        setDetails({
          name: response.data.name,
          email: response.data.email,
          phoneNo: response.data.phoneNo,
          accountId: response.data.accountId,
          province: response.data.province,
          district: response.data.district,
          municipality: response.data.municipality,
          role: response.data.role,
          dateOfBirth: formatDate(response.data.dateOfBirth),
        });
        setProfilePhoto(response.data.profilePhotoPath);
        setDocumentePhoto(response.data.citizenshipImagePath);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (details.province) {
      const selectedProvince = provinces.find(
        (p) => p.name === details.province
      );
      setDistricts(selectedProvince ? selectedProvince.districts : []);
    }
  }, [details.province]);

  useEffect(() => {
    if (details.district) {
      const selectedDistrict = districts.find(
        (d) => d.name === details.district
      );
      setMunicipalities(
        selectedDistrict
          ? [
              ...selectedDistrict.municipalities,
              ...selectedDistrict.ruralMunicipalities,
            ]
          : []
      );
    }
  }, [details.district]);

  useEffect(() => {
    // Set province options
    const provinces = locationData.map(province => ({
      value: province.name,
      label: province.name
    }));
    setProvinceOptions(provinces);
  }, []);

  useEffect(() => {
    if (details.province) {
      const province = locationData.find(p => p.name === details.province);
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
  }, [details.province]);

  useEffect(() => {
    if (details.province && details.district) {
      const province = locationData.find(p => p.name === details.province);
      const district = province?.districts.find(d => d.name === details.district);
      if (district) {
        const allMunicipalities = [
          ...(district.municipalities || []),
          ...(district.ruralMunicipalities || [])
        ].map(municipality => ({
          value: municipality,
          label: municipality
        }));
        setMunicipalityOptions(allMunicipalities);
      }
    } else {
      setMunicipalityOptions([]);
    }
  }, [details.province, details.district]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSavePersonalDetails = async () => {
    setIsSavingPersonal(true);
    try {
      await Api.put(
        "auth/update-user-details",
        {
          ...details,
          dateOfBirth: new Date(details.dateOfBirth).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Personal details updated successfully!");
    } catch (error) {
      console.error("Error saving personal details:", error);
      toast.error("Failed to update personal details.");
    } finally {
      setIsSavingPersonal(false);
      setIsEditingPersonal(false); // Stop editing after saving
    }
  };

  const handleSaveAddressDetails = async () => {
    setIsSavingAddress(true);
    try {
      await Api.put(
        "auth/update-user-details",
        {
          province: details.province,
          district: details.district,
          municipality: details.municipality,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Address details updated successfully!");
    } catch (error) {
      console.error("Error saving address details:", error);
      toast.error("Failed to update address details.");
    } finally {
      setIsSavingAddress(false);
      setIsEditingAddress(false); // Stop editing after saving
    }
  };

  const handleEditPersonalDetails = () => {
    setIsEditingPersonal(true);
  };

  const handleEditAddressDetails = () => {
    setIsEditingAddress(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleProfilePicClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };
  const handleProfilePicUpload = () => {
    // Handle image upload logic if required
  };
  const handleImagePreviewClick = () => {
    setIsImagePreviewOpen(true);
  };

  const handleImagePreviewClose = () => {
    setIsImagePreviewOpen(false);
  };
  return (
    <div className="w-full min-h-screen  bg-brand-bgColor  text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {isLoading ? (
            <div className="w-full absolute top-0 left-0 h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          ) : (
            <>
              {/* Profile Picture Section */}
              <div className="lg:ml-12 space-y-8">
                <div className="relative group">
                  <div className="w-64 h-64 mx-auto overflow-hidden rounded-full shadow-lg border-4 border-blue-500">
                    {profilePhoto ? (
                      <img
                        className="w-full h-full object-cover transition duration-300 "
                        src={profilePhoto}
                        alt="Profile"
                      />
                    ) : (
                      <img
                        className="w-full h-full object-cover transition duration-300 "
                        src={manpng}
                        alt="Default Profile"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="profilePic"
                    className="absolute bottom-4 right-4 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition duration-300"
                  >
                    <PenBoxIcon
                      onClick={handleProfilePicClick}
                      className="w-6 h-6 text-white"
                    />
                  </label>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <h2 className="py-3 text-center font-sans text-lg font-bold bg-blue-600">
                    Attached Document
                  </h2>
                  <div className="relative p-4">
                    {citizenshipImagePath ? (
                      <img
                        className="w-full h-48 object-cover rounded-lg filter blur-sm"
                        src={citizenshipImagePath}
                        alt="Document"
                      />
                    ) : (
                      <p className="text-center py-4">No citizenship image available.</p>
                    )}
                    <button
                      onClick={handleImagePreviewClick}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded-lg transition duration-300 hover:bg-opacity-70"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal and Address Details Section */}
              <div className="lg:w-2/3 space-y-8">
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                  <h1 className="text-3xl font-bold mb-6 text-blue-400">Personal Details</h1>
                  <div className="bg-gray-700 p-4 rounded-lg mb-6 flex justify-between text-sm">
                    <h2 className="font-semibold">
                      Client ID: <span className="text-blue-300">{details.accountId}</span>
                    </h2>
                    <h2 className="font-semibold">
                      Account Type: <span className="text-blue-300">{user.role === 0 ? "Client" : "Admin"}</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["name", "email", "phoneNo", "dateOfBirth"].map((key) => (
                      <div className="relative" key={key}>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={details[key]}
                          onChange={handlePersonalChange}
                          disabled={!isEditingPersonal}
                          className="w-full p-3 rounded-md bg-gray-700 focus:ring-2 focus:ring-blue-500 border-transparent outline-none transition duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  {!isEditingPersonal ? (
                    <button
                      className="mt-6 text-blue-400 hover:text-blue-300 transition duration-300"
                      onClick={handleEditPersonalDetails}
                    >
                      Edit Personal Details
                    </button>
                  ) : (
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition duration-300"
                        onClick={() => setIsEditingPersonal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                        onClick={handleSavePersonalDetails}
                        disabled={isSavingPersonal}
                      >
                        {isSavingPersonal ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "Save Personal Details"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                  <h1 className="text-3xl font-bold mb-6 text-blue-400">Address Details</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Province
                      </label>
                      <Select
                        value={provinceOptions.find(option => option.value === details.province)}
                        options={provinceOptions}
                        onChange={(option) => {
                          setDetails({
                            ...details,
                            province: option.value,
                            district: "",
                            municipality: ""
                          });
                        }}
                        isDisabled={!isEditingAddress}
                        placeholder="Select Province"
                        isSearchable={true}
                        className="text-black"
                        menuPlacement="top"
                        menuPosition="fixed"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: !isEditingAddress ? '#374151' : 'white',
                            borderColor: '#374151',
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: !isEditingAddress ? 'white' : 'black',
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        District
                      </label>
                      <Select
                        value={districtOptions.find(option => option.value === details.district)}
                        options={districtOptions}
                        onChange={(option) => {
                          setDetails({
                            ...details,
                            district: option.value,
                            municipality: ""
                          });
                        }}
                        isDisabled={!isEditingAddress || !details.province}
                        placeholder="Select District"
                        isSearchable={true}
                        className="text-black"
                        menuPlacement="top"
                        menuPosition="fixed"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: !isEditingAddress ? '#374151' : 'white',
                            borderColor: '#374151',
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: !isEditingAddress ? 'white' : 'black',
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Municipality
                      </label>
                      <Select
                        value={municipalityOptions.find(option => option.value === details.municipality)}
                        options={municipalityOptions}
                        onChange={(option) => {
                          setDetails({
                            ...details,
                            municipality: option.value
                          });
                        }}
                        isDisabled={!isEditingAddress || !details.district}
                        placeholder="Select Municipality"
                        isSearchable={true}
                        className="text-black"
                        menuPlacement="top"
                        menuPosition="fixed"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: !isEditingAddress ? '#374151' : 'white',
                            borderColor: '#374151',
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: !isEditingAddress ? 'white' : 'black',
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                      />
                    </div>
                  </div>
                  {!isEditingAddress ? (
                    <button
                      className="mt-6 text-blue-400 hover:text-blue-300 transition duration-300"
                      onClick={handleEditAddressDetails}
                    >
                      Edit Address Details
                    </button>
                  ) : (
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition duration-300"
                        onClick={() => setIsEditingAddress(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                        onClick={handleSaveAddressDetails}
                        disabled={isSavingAddress}
                      >
                        {isSavingAddress ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "Save Address Changes"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ProfilePopup Component */}
      <ProfilePopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onUpload={handleProfilePicUpload}
      />

      {/* Image Preview Popup */}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8  rounded-lg relative w-fit mx-4">
            <button
              onClick={handleImagePreviewClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition duration-300"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <img
              src={citizenshipImagePath}
              alt="Document Preview"
              className="w-[450px] h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
