import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from '../utils/Api.js'
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import toast for notifications
import TermsAndConditionsPopup from "../Components/terms_conditionPupup";
import Mainlogo from '../assets/img/Main_logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    dateOfBirth: "",
    address: "",
    password: "",
    profilePhoto: null,
    citizenshipImage: null,
    role: 0, // Default to client role
  });
  const [loading, setLoading] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
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
  };

  const validateForm = () => {
    const { name, email, phoneNo, dateOfBirth, address, password, profilePhoto, citizenshipImage } = formData;

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
    if (!address) {
      toast.error("Address is required.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
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
      toast.success("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/client-login");
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

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
        <span className="text-center text-xs">Already have an Account? Go to </span>
        <Link to="/client-login" className="hover:text-opacity-80 text-blue-600">
          <strong>Login</strong>
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto p-4 sm:w-1/2">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
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
                    required
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
                    required
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
                    required
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
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <div className="mt-1">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="md:flex md:flex-row md:justify-between md:gap-12 flex flex-col gap-4">
              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-600">
                  Profile Photo
                </label>
                <div className="mt-1">
                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-[80%] w-[100%]">
                <label htmlFor="citizenshipImage" className="block text-sm font-medium text-gray-600">
                  Citizenship Image
                </label>
                <div className="mt-1">
                  <input
                    id="citizenshipImage"
                    name="citizenshipImage"
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="checkbox"
                onChange={(e) => setCanTickCheckbox(e.target.checked)}
                checked={canTickCheckbox}
                className="mr-2"
                disabled={isTermsAccepted}
              />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={openTerms}
                  className="text-blue-600 hover:text-opacity-80"
                >
                  Terms and Conditions
                </button>
              </span>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <TermsAndConditionsPopup isOpen={isTermsOpen} onClose={closeTerms} onAccept={acceptTerms} />
    </div>
  );
};

export default Register;
