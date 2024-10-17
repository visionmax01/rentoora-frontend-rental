import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import TermsAndConditionsPopup from "../utils/terms_conditionPupup";
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
  const [termsError, setTermsError] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [canTickCheckbox, setCanTickCheckbox] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    setFormData({ ...formData, [name]: file });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  const validateForm = () => {
    const { name, email, phoneNo, dateOfBirth, province, profilePhoto, citizenshipImage } = formData;

    if (!name) {
      toast.error("Name is required.");
      return false;
    }
    if (!email) {
      toast.error("Email is required.");
      return false;
    }
    if (!phoneNo) {
      toast.error("Phone number is required.");
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

      const response = await axios.post(
        "https://rentoora-backend-rental.onrender.com/auth/register",
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
        <p className="text-sm text-red-700 text-center capitalize">after register successfully check your Email for passowrd !</p>
      </div>
      {error && <div className="text-red-500 bg-red-200 w-fit mx-auto p-2 mt-2 rounded  text-center">{error}</div>}
            {successMessage && (
              <div className="text-green-500 text-center bg-red-200 w-fit mx-auto p-2 mt-2 rounded">{successMessage}</div>
            )}
      <div className="mt-2 sm:mx-auto p-4 sm:w-1/2">
        <div className="relative bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
        
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
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

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email address
                </label>
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
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600">
                  Date of Birth
                </label>
                <div className="mt-1">
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
            </div>
            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="province" className="block text-sm font-medium text-gray-600">
                  Province
                </label>
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
                <label htmlFor="district" className="block text-sm font-medium text-gray-600">
                  District
                </label>
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
            <div className="md:w-[100%] w-[100%]">
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-600">
                Municipality
              </label>
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

            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-600">
                  Profile Photo
                </label>
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
                <label htmlFor="citizenshipImage" className="block text-sm font-medium text-gray-600">
                  Citizenship Image
                </label>
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

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={() => {
                  if (canTickCheckbox) {
                    setIsTermsAccepted(!isTermsAccepted);
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
                Read
              </button>
            </div>

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
      <TermsAndConditionsPopup
        isOpen={isTermsOpen}
        onClose={closeTerms}
        onAccept={acceptTerms}
      />
    </div>
  );
};

export default Register;
