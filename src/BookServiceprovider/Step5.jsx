import React, { useState } from 'react';

const Step5 = ({ formData, handleSubmit, handlePrevStep, providers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const selectedProvider = formData.selectedProvider || providers.find(provider => provider._id === formData.providerId || provider.providerId === formData.providerId);

  const handleConfirmBooking = async () => {
    setIsLoading(true); // Start loading
    await handleSubmit(); // Perform the submit action
    setIsLoading(false); // Stop loading after submission
  };

  return (
    <div className="lg:w-[95%] w-full  p-2 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-indigo-700 mb-2">Step 5: Preview & Confirm</h3>
      <div className="flex flex-wrap gap-8">
      {/* Display user form data */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-2 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Booking Details</h4>
        <div className="space-y-2">
          <div className='lg:flex justify-between gap-4'>
          <div className="flex w-full items-center space-x-2 p-3   bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-600 font-bold">{formData.name}</span>
          </div>

          <div className="flex w-full mt-4 lg:mt-0 items-center space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-600 font-bold">{formData.phoneNo}</span>
          </div>
          </div>

          <div className="lg:flex lg:flex-row flex-col  items-center space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <div className='flex items-center space-x-2'>
             <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-gray-700">Address:</span>
            </div>
            <div className=''>
            <span className="text-gray-600 font-bold">{formData.address}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-gray-700">Service Type:</span>
            <span className="text-gray-600 font-bold">{formData.serviceType}</span>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-gray-700">Booking Date:</span>
            <span className="text-gray-600 font-bold">{formData.bookingDate}</span>

          </div>
          <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-700">Booking Slot:</span>
            <span className="text-gray-600 font-bold">{formData.timeSlot}</span>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors duration-200">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-700">Rate Charge:</span>
            <span className="text-gray-600 font-bold">₹{formData.rateCharge}/hr</span>
          </div>
        </div>
      </div>

      {/* Display provider details in a card if available */}
      {selectedProvider ? (
        <div className="mb-8 bg-gradient-to-br h-fit from-purple-100 via-indigo-100 to-blue-100 lg:p-6 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col justify-start items-start space-y-2 md:space-y-0 md:space-x-6">
            <div className="relative mb-2 lg:ml-6 ">
              <div className="relative w-fit">
              <img 
                src={selectedProvider.profilePhotoPath} 
                alt={selectedProvider.name} 
                className="w-20 h-20  rounded object-cover border-4 border-white shadow-md"
                onError={(e) => {
                  e.target.src = '/default-profile-image.png'; 
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-green-400 rounded-full ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              </div>
            </div>
            <div className="flex-grow text-left md:text-left">
              <h4 className="lg:text-2xl text-md font-bold text-indigo-900 mb-4">Provider Details</h4>
              <div className="space-y-0">
                <p ><span className="font-semibold text-indigo-600">Name:</span> <span className="text-gray-700">{selectedProvider.name}</span></p>
                <p><span className="font-semibold text-indigo-600">Phone:</span> <span className="text-gray-700">{selectedProvider.phoneNo}</span></p>
                <p ><span className="font-semibold text-indigo-600">Service:</span> <span className="text-gray-700">{selectedProvider.servicesType}</span></p>
                <p ><span className="font-semibold text-indigo-600">Experience:</span> <span className="text-gray-700">{selectedProvider.experience} years</span></p>
                <p ><span className="font-semibold text-indigo-600">Working Hours:</span> <span className="text-gray-700">{selectedProvider.workingFrom} - {selectedProvider.workingTo}</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 text-red-500 bg-red-50 p-4 rounded-lg">No provider selected.</div>
      )}
      </div>

      {/* Buttons for navigation */}
      <div className="flex justify-between items-center mt-8">
        <button 
          onClick={handlePrevStep} 
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back
        </button>
        
        {/* Confirm Booking Button with Loading State */}
        <button 
          onClick={handleConfirmBooking} 
          disabled={isLoading} 
          className={`px-6 py-2 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Confirming...</span>
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  );
};

export default Step5;
