import React, { useState } from "react";
import { motion } from "framer-motion";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import SuccessPage from "./SuccessPage";
import Api from "../utils/Api.js";
import { toast } from "react-toastify";
import Mainlogo from "../assets/img/Main_logo.png";
import { FaHome } from 'react-icons/fa';

import { Link } from "react-router-dom";
const stepNames = [
  "Personal Info",
  "Service Details",
  "Provider Selection",
  "Booking Date & Time",
  "Confirmation",
];

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    address: "",
    serviceType: "",
    providerId: "",
    bookingDate: "",
    timeSlot: "",
    rateCharge: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingID, setBookingID] = useState(null);
  const [providers, setProviders] = useState([]); // Manage providers in state

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    // Validate the form data before making the request
    if (
      !formData.name ||
      !formData.phoneNo ||
      !formData.address ||
      !formData.serviceType ||
      !formData.providerId ||
      !formData.bookingDate ||
      !formData.timeSlot
    ) {
      toast.error("All fields are required!");  // Show error if fields are missing
      return;
    }
  
    try {
      // Make the API call to create a booking
      const response = await Api.post("book-provider/create-order", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Check if response contains a message, then display it in toast
      if (response.data && response.data.message) {
        // Display success message
        toast.success(response.data.message);
      }
  
      // Store the booking ID from the response
      setBookingID(response.data.booking.bookingId);
  
      // Set the booking success flag to true
      setBookingSuccess(true);
  
    } catch (error) {
      console.error("Error creating booking:", error);
  
      // Check if the error response contains a message, then display it in toast
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);  // Display error message from backend
      } else {
        // Show a general error message if none is provided
        toast.error("Something went wrong!");
      }
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            setProviders={setProviders}
            providers={providers}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            setFormData={setFormData}
            providers={providers}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
          />
        );
      case 5:
        return (
          <Step5
            formData={formData}
            setFormData={setFormData}
            handlePrevStep={handlePrevStep}
            handleSubmit={handleSubmit}
            providers={providers}
          />
        );
      default:
        return null;
    }
  };

  const stepIndicator = (stepIndex) => {
    const stepCompleted = step > stepIndex;
    const isCurrentStep = step === stepIndex + 1;
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center relative">
          {/* Progress line */}
          {stepIndex < 4 && (
            <div className="absolute lg:w-[120px] w-[70px] h-0.5 bg-gray-300 lg:left-full left-[60px] top-3.5 -translate-x-1/2 -translate-y-1/2">
              <div 
                className={`h-full transition-all duration-300 ${
                  stepCompleted ? "bg-yellow-400 w-full" : 
                  isCurrentStep ? "bg-yellow-400 w-1/2" : "w-0"
                }`}
              />
            </div>
          )}
          
          {/* Step indicator */}
          <div
            className={`w-7 h-7 flex  items-center justify-center rounded-full border-2 
              transition-all duration-300 shadow-lg z-10
              ${
                stepCompleted
                  ? "bg-gradient-to-r from-green-400 to-green-500 border-yellow-600 text-purple-900"
                  : isCurrentStep
                  ? "bg-gradient-to-r from-purple-600 to-purple-800 border-purple-400 text-yellow-400"
                  : "bg-gray-800 border-gray-600 text-gray-400"
              }
            `}
          >
            {stepCompleted ? (
              <span className="text-lg">🎉</span>
            ) : (
              <span className="font-bold">{stepIndex + 1}</span>
            )}
          </div>

          {/* Step name */}
          <p className={`mt-2 text-[10px] lg:text-sm w-16 lg:w-24 font-medium text-center
            ${stepCompleted || isCurrentStep ? "text-yellow-400" : "text-white"}
            hidden sm:block
          `}>
            {stepNames[stepIndex]}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-screen bg-transparent">
      <div className="lg:w-1/4 hidden relative sm:block bg-gradient-to-r from-brand-bgColor to-brand-Colorpurple text-white/85 py-6 overflow-y-auto">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <Link to="/" className="absolute top-6 left-5 z-10 flex items-center justify-center p-3 rounded-full hover:bg-gray-300/20 transition-colors">
        <FaHome className="h-6 w-6 text-gray-200 " />
        </Link>
        <h1 className="text-2xl font-bold text-center ml-4 text-white mb-2">Welcome to</h1>
        <img className="h-12  mx-auto w-fit mb-8" src={Mainlogo} alt="Logo" />
        <div className="mt-8 px-6">
          <p className="text-sm text-justify leading-relaxed mb-6">
            Experience our streamlined booking system for professional services. From electricians to plumbers, schedule with ease in just a few clicks. Provide your details, choose your service and provider, then select a convenient time slot. Get instant confirmation and a unique booking ID. Enjoy a hassle-free process that puts top-notch service at your fingertips.
          </p>

          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-yellow-300 mb-3">Booking Steps:</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><span className="mr-2 text-yellow-300">1.</span> Confirm Personal Info</li>
              <li className="flex items-center"><span className="mr-2 text-yellow-300">2.</span> Select Service Type</li>
              <li className="flex items-center"><span className="mr-2 text-yellow-300">3.</span> Choose a Provider</li>
              <li className="flex items-center"><span className="mr-2 text-yellow-300">4.</span> Pick a Date & Time</li>
              <li className="flex items-center"><span className="mr-2 text-yellow-300">5.</span> Confirm Booking</li>
            </ul>
          </div>
          
          <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
            <p className="text-red-300 font-semibold text-sm">Note: All fields are required!</p>
          </div>
        </div>
        <footer className="mt-8 absolute bottom-0 w-full">
          <p className="text-xs text-center w-full bg-black/30 py-3">&copy; {new Date().getFullYear()} Copyright Bhishan Technology. All Rights Reserved!</p>
        </footer>
      </div>
      <div className="lg:w-3/4 w-full flex flex-col bg-transparent rounded-lg shadow-md">
        <div className="bg-gradient-to-r to-brand-bgColor from-brand-Colorpurple text-white/85 border-b border-black/35 px-2 lg:px-4 py-6">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
           <Link to="/" className="flex lg:hidden items-center justify-center p-3 rounded-full hover:bg-gray-300/20 transition-colors">
           <FaHome className="h-6 w-6 text-gray-200  mr-3" /> Back to Home
           </Link>
          <p className="font-semibold text-sm lg:text-lg text-center lg:text-left">Request Electrician & Plumber Now!</p>
          <div className="flex w-full gap-1 lg:gap-6 mt-3 items-start justify-between lg:justify-start">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex relative">
                {stepIndicator(index)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-grow bg-white rounded-tl-lg overflow-y-auto">
          {bookingSuccess ? (
            <SuccessPage bookingID={bookingID} />
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="p-2 rounded-tl-lg lg:p-2"
            >
              {renderStep()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
