import React, { useState } from 'react';
import Electrician from '../assets/img/electrician.png'
import Plumber from '../assets/img/plumber.png'

const Step2 = ({ formData, setFormData, handleNextStep, handlePrevStep }) => {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!formData.serviceType) {
      setError('Please select a service type');
    } else {
      setError('');
      handleNextStep();
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <h3 className="lg:text-2xl text-md font-bold text-indigo-700 mb-6">Step 2: Select Your Service</h3>
      <div className="bg-white shadow-lg rounded-lg p-6 relative">
        <p className="text-lg text-gray-700 mb-6">Choose the service you need:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => setFormData({ ...formData, serviceType: 'Electrician' })}
            className={`flex flex-col items-center justify-center p-6 rounded-lg transition duration-300 cursor-pointer ${
              formData.serviceType === 'Electrician'
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-gray-100 border-2 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <img 
              src={Electrician} 
              alt="Electrician"
              className={`w-16 h-16 rounded-full mb-4${"" }`}
            />
            <p className={`text-xl font-semibold ${formData.serviceType === 'Electrician' ? 'text-green-700' : 'text-gray-800'}`}>
              Electrician
            </p>
          </div>

          <div
            onClick={() => setFormData({ ...formData, serviceType: 'Plumber' })}
            className={`flex flex-col items-center justify-center p-6 rounded-lg transition duration-300 cursor-pointer ${
              formData.serviceType === 'Plumber'
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <img 
              src={Plumber}
              alt="Plumber"
              className="w-16 h-16 rounded-full mb-4"
            />
            <p className={`text-xl font-semibold ${formData.serviceType === 'Plumber' ? 'text-green-700' : 'text-gray-800'}`}>
              Plumber
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm">{error}</div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevStep}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Back
          </button>
          <button 
            onClick={handleNext} 
            className={`px-6 py-2 rounded-md transition duration-300 ${
              formData.serviceType
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceButton = ({ type, image, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 rounded-lg transition duration-300 ${
      isSelected
        ? 'bg-blue-100 border-2 border-blue-500'
        : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    <img src={image} className="w-24 h-24 rounded-full mb-4" alt={type} />
    <p className={`text-xl font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
      {type}
    </p>
  </button>
);

export default Step2;
