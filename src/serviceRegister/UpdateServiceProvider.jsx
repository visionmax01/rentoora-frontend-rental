import React, { useState, useEffect } from 'react';
import Api from '../utils/Api.js';
import { toast } from 'react-toastify';

const UpdateServiceProvider = ({ providerId, currentData, handlePrev }) => {
  const [formData, setFormData] = useState({
    servicesType: currentData.servicesType || '',
    experience: currentData.experience || '',
    workingFrom: currentData.workingFrom || '',
    workingTo: currentData.workingTo || '',
    examResults: currentData.examResults || '',
    address: currentData.address || '',
  });

  const [certificateFile, setCertificateFile] = useState(null);  // For the new certificate file
  const [loading, setLoading] = useState(false);

  // To preview the current certificate image if it exists
  const [currentCertificate, setCurrentCertificate] = useState(currentData.certificateUrl || null);

  // Update form data as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (name) => (e) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCertificateFile(file);
    if (file) {
      // Preview the image if it's an image file
      const previewUrl = URL.createObjectURL(file);
      setCurrentCertificate(previewUrl);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const data = new FormData();
    data.append('servicesType', formData.servicesType);
    data.append('experience', formData.experience);
    data.append('workingFrom', formData.workingFrom);
    data.append('workingTo', formData.workingTo);
    data.append('examResults', formData.examResults);
    data.append('address', formData.address);

    // Append the certificate file if a new file is selected
    if (certificateFile) {
      data.append('certificate', certificateFile);
    }

    try {
      const response = await Api.put(`/service-provider/${providerId}/update`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        toast.success('Service provider details updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update details:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to update the details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">Update Service Provider Details</h2>
      
      <div className="space-y-4 text-black">
        <div className="flex gap-16">
          {/* Service Type Dropdown */}
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Service Type</label>
            <select
              name="servicesType"
              value={formData.servicesType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select Service Type</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
            </select>
          </div>

          {/* Experience Input */}
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter years of experience"
            />
          </div>
        </div>

        <div className="flex gap-16">
          {/* Custom Time Picker for "Working From" */}
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Working From</label>
            <input
              type="time"
              name="workingFrom"
              value={formData.workingFrom}
              onChange={handleTimeChange('workingFrom')}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Custom Time Picker for "Working To" */}
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Working To</label>
            <input
              type="time"
              name="workingTo"
              value={formData.workingTo}
              onChange={handleTimeChange('workingTo')}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-16">
          {/* Exam Results Input */}
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Exam Results</label>
            <textarea
              name="examResults"
              value={formData.examResults}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="1"
              disabled
              placeholder="Enter exam results"
            />
          </div>

          {/* Address Input */}
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter address"
              disabled
            />
          </div>
        </div>

        {/* Certificate File Input */}
        <div className="w-full">
          <label className="block text-lg font-semibold text-gray-700">Certificate</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {currentCertificate && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Current Certificate</h3>
              <img
                src={currentCertificate}
                alt="Current certificate preview"
                className="w-20 h-20 mt-2 rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="px-6 py-2 h-8 w-8 text-lg bg-gray-400 rounded-md text-white hover:bg-gray-500"
        >
          Previous
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 text-lg bg-blue-500 rounded-md text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default UpdateServiceProvider;
