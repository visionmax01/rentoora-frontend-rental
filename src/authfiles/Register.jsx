import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from '../utils/Api.js'
import { FaSpinner } from "react-icons/fa";
import TermsAndConditionsPopup from "../utils/terms_conditionPupup.jsx"; // Ensure this path is correct
import Mainlogo from "../assets/img/Main_logo.png";
import toast from "react-hot-toast";
import { locationData } from "../utils/LocationData";

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

  const navigate = useNavigate();

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
    setIsTermsAccepted(true);
    setCanTickCheckbox(true);
    setIsTermsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src={Mainlogo} className="h-12 m-auto" alt="" />
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Client Registration Form
        </h2>
        <span className="text-center text-xs">
          Already have an Account? Go to{" "}
        </span>
        <Link to="/client-login" className="hover:text-opacity-80 text-blue-600">
          <strong>Login</strong>
        </Link>
        <p className="text-[13px] text-red-700 text-center capitalize">After registering successfully, check your Email for  password !</p>
      </div>

      {error && <div className="text-red-500 bg-red-200 w-fit mx-auto p-2 mt-2 rounded text-center">{error}</div>}
      {successMessage && (
        <div className="text-green-500 text-center bg-red-200 w-fit mx-auto p-2 mt-2 rounded">{successMessage}</div>
      )}

      <div className="mt-2 sm:mx-auto p-4 sm:w-1/2">
        <div className="relative bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              {/* Name */}
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email address <span className="text-[12px]">(Business/School Email not Allowed)</span></label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Other Fields */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-600">Phone Number</label>
                <div className="mt-1">
                  <input
                    id="phoneNo"
                    name="phoneNo"
                    type="text"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600">Date of Birth</label>
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
                <label htmlFor="province" className="block text-sm font-medium text-gray-600">Province</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict("");
                    setSelectedMunicipality("");
                    setFormData({ ...formData, province: e.target.value });
                  }}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Province</option>
                  {locationData.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="district" className="block text-sm font-medium text-gray-600">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedMunicipality("");
                    setFormData({ ...formData, district: e.target.value });
                  }}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select District</option>
                  {selectedProvinceObj?.districts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Municipality Select */}
            <div className="md:w-[100%] w-[100%]">
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-600">Municipality</label>
              <select
                value={selectedMunicipality}
                onChange={(e) => {
                  setSelectedMunicipality(e.target.value);
                  setFormData({ ...formData, municipality: e.target.value });
                }}
                className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Municipality</option>
                {selectedDistrictObj?.municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>

            {/* File Uploads */}
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-600">Profile Photo</label>
                <input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
                {previewImages.profilePhoto && (
                  <img
                    src={previewImages.profilePhoto}
                    alt="Profile Preview"
                    className="mt-2 w-24 h-24 rounded-full"
                  />
                )}
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="citizenshipImage" className="block text-sm font-medium text-gray-600">Citizenship Image</label>
                <input
                  id="citizenshipImage"
                  name="citizenshipImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
                {previewImages.citizenshipImage && (
                  <img
                    src={previewImages.citizenshipImage}
                    alt="Citizenship Preview"
                    className="mt-2 w-24 h-24 rounded"
                  />
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={() => {
                  if (canTickCheckbox) {
                    setIsTermsAccepted(!isTermsAccepted);
                  } else {
                    toast.error("Please read and accept the terms first.");
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I accept the terms and conditions
              </label>
              <button
                type="button"
                onClick={openTerms}
                className="ml-1 text-blue-600 hover:underline"
              >
                Read me to Accept!
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
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
