import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from '../utils/Api.js'
import { FaSpinner } from "react-icons/fa";
import TermsAndConditionsPopup from "../utils/terms_conditionPupup.jsx"; // Ensure this path is correct
import Mainlogo from "../assets/img/Main_logo.png";
import {toast} from "react-toastify";
import { locationData } from "../utils/LocationData";
import Select from 'react-select';

const Register = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    dateOfBirth: "",
    profilePhoto: null,
    citizenshipImage: null,
    role: 0,
    province: "",
    district: "",
    municipality: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    profilePhoto: null,
    citizenshipImage: null,
  });
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [canTickCheckbox, setCanTickCheckbox] = useState(false);

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Set province options
    const provinces = locationData.map(province => ({
      value: province.name,
      label: province.name
    }));
    setProvinceOptions(provinces);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const province = locationData.find(p => p.name === selectedProvince);
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
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedProvince && selectedDistrict) {
      const province = locationData.find(p => p.name === selectedProvince);
      const district = province?.districts.find(d => d.name === selectedDistrict);
      if (district) {
        // Combine municipalities and ruralMunicipalities
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
  }, [selectedProvince, selectedDistrict]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in the name field
    if (name === "name" && /[0-9]/.test(value)) {
      toast.error("Name cannot contain numbers.");
      return; // Prevent updating the state if input is invalid
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    if (file && file.size > 1 * 1024 * 1024) {
      toast.error("File size exceeds 1MB. Please upload a smaller file.");
      return;
    }

    setFormData({ ...formData, [name]: file });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  const validatePhoneNumber = (phoneNo) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNo);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { name, email, phoneNo, dateOfBirth, profilePhoto, citizenshipImage } = formData;

    if (!name) {
      toast.error("Name is required.");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid Gmail address.");
      return false;
    }
    if (email && !email.endsWith("@gmail.com" )) {
      toast.error("Only Gmail addresses are allowed.");
      return false;
    }
    if (!phoneNo) {
      toast.error("Phone number is required.");
      return false;
    }
    if (!validatePhoneNumber(phoneNo)) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }
    if (!dateOfBirth) {
      toast.error("Date of birth is required.");
      return false;
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (age < 18) {
      toast.error("You must be at least 18 years old.");
      return false;
    }
    if (!profilePhoto) {
      toast.error("Profile photo is required.");
      return false;
    }
    if (!citizenshipImage) {
      toast.error("Citizenship image is required.");
      return false;
    }
    if (!isTermsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await Api.post(
        "auth/register",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setLoading(false);
      setSuccessMessage("Registration successful! Redirecting to login...");
      toast.success("Registration successful! Check your email for password...");

      setTimeout(() => {
        navigate("/client-login");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "An error occurred");
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const selectedProvinceObj = locationData.find(
    (province) => province.name === selectedProvince
  );

  const selectedDistrictObj = selectedProvinceObj?.districts.find(
    (district) => district.name === selectedDistrict
  );

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);
  const acceptTerms = () => {
    if (isTermsOpen) {
      setIsTermsAccepted(true);
      setCanTickCheckbox(true);
      setIsTermsOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full  flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src={Mainlogo} className="h-10 mt-2 m-auto" alt="" />
        <h2 className="text-center lg:text-2xl text-xl font-extrabold text-gray-900">
           Registration Form
        </h2>
        <span className="text-center text-xs">
          Already have an Account? Go to{" "}
        </span>
        <Link to="/client-login" className="hover:text-opacity-80 text-blue-600">
          <strong>Login</strong>
        </Link>
        <p className="text-[10px] lg:text-[13px] text-red-700 text-center capitalize">After registering successfully, check your Email for  password !</p>
      </div>

      {error && <div className="text-red-500 bg-red-200 w-fit mx-auto p-2 mt-2 rounded text-center">{error}</div>}
      {successMessage && (
        <div className="text-green-500 text-center bg-red-200 w-fit mx-auto p-2 mt-2 rounded">{successMessage}</div>
      )}

      <div className="mt-2 sm:mx-auto p-4  w-full">
        <div className="relative bg-white py-6 px-4  lg:w-[60%] mx-auto shadow-md shadow-gray-300 rounded-lg border border-gray-300 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              {/* Name */}
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email address <span className="text-red-500">*</span> <span className="text-[12px]">(Business/School Email not Allowed)</span>
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Other Fields */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-600">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </span>
                  <input
                    id="phoneNo"
                    name="phoneNo"
                    type="text"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Location Selects */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="province" className="block text-sm font-medium text-gray-600">
                  Province <span className="text-red-500">*</span>
                </label>
                <Select
                  value={provinceOptions.find(option => option.value === selectedProvince)}
                  options={provinceOptions}
                  onChange={(option) => {
                    setSelectedProvince(option.value);
                    setSelectedDistrict("");
                    setSelectedMunicipality("");
                    setFormData({ ...formData, province: option.value, district: "", municipality: "" });
                  }}
                  placeholder="Select Province"
                  isSearchable={true}
                  className="mt-1"
                />
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="district" className="block text-sm font-medium text-gray-600">
                  District <span className="text-red-500">*</span>
                </label>
                <Select
                  value={districtOptions.find(option => option.value === selectedDistrict)}
                  options={districtOptions}
                  onChange={(option) => {
                    setSelectedDistrict(option.value);
                    setSelectedMunicipality("");
                    setFormData({ ...formData, district: option.value, municipality: "" });
                  }}
                  placeholder="Select District"
                  isSearchable={true}
                  isDisabled={!selectedProvince}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Municipality Select */}
            <div className="md:w-[100%] w-[100%]">
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-600">
                Municipality <span className="text-red-500">*</span>
              </label>
              <Select
                value={municipalityOptions.find(option => option.value === selectedMunicipality)}
                options={municipalityOptions}
                onChange={(option) => {
                  setSelectedMunicipality(option.value);
                  setFormData({ ...formData, municipality: option.value });
                }}
                placeholder="Select Municipality"
                isSearchable={true}
                isDisabled={!selectedDistrict}
                className="mt-1"
              />
            </div>

            {/* File Uploads */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-8">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-600 mb-2">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-indigo-500 transition-colors duration-300">
                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {previewImages.profilePhoto ? (
                    <div className="text-center">
                      <img
                        src={previewImages.profilePhoto}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-500"
                      />
                      <p className=" text-sm text-gray-600">Click to change profile photo</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className=" text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="citizenshipImage" className="block text-sm font-medium text-gray-600 mb-2">
                  Citizenship Image <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-indigo-500 transition-colors duration-300">
                  <input
                    id="citizenshipImage"
                    name="citizenshipImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {previewImages.citizenshipImage ? (
                    <div className="text-center">
                      <img
                        src={previewImages.citizenshipImage}
                        alt="Citizenship Preview"
                        className="w-1/2 h-24 rounded object-fit mx-auto border-4 border-indigo-500"
                      />
                      <p className="mt-2 text-sm text-gray-600">Click to change citizenship image</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={() => {
                  if (!canTickCheckbox) {
                    toast.error("Please read the terms and conditions first");
                    openTerms(); // Automatically open terms when they try to tick without reading
                    return;
                  }
                  setIsTermsAccepted(!isTermsAccepted);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={openTerms}
                className=" text-blue-600 ml-3 hover:underline text-sm  block md:inline-block "
              >
                Accept & Read Terms - Conditions
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Popup */}
      <TermsAndConditionsPopup
        isOpen={isTermsOpen}
        onClose={closeTerms}
        onAccept={acceptTerms}
      />
    </div>
  );
};

export default Register;
