import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Toast for notifications

const UpdateClient = ({ client, onClose, refreshClients }) => {
  // State for client details
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [phoneNo, setPhoneNo] = useState(client.phoneNo);
  const [province, setProvince] = useState(client.province);
  const [district, setDistrict] = useState(client.district);
  const [municipality, setMunicipality] = useState(client.municipality);
  const [citizenshipPhoto, setCitizenshipPhoto] = useState(null);

  // Helper function to format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Set initial date of birth in the format MM/DD/YYYY
  const [dateOfBirth, setDateOfBirth] = useState(
    client.dateOfBirth ? formatDate(client.dateOfBirth) : ""
  );

  // Handle citizenship photo file upload
  const handleCitizenshipPhotoChange = (e) => setCitizenshipPhoto(e.target.files[0]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dateOfBirth back to YYYY-MM-DD format for submission
    const dateParts = dateOfBirth.split("/");
    const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`; // YYYY-MM-DD format

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    formData.append("province", province);
    formData.append("district", district);
    formData.append("municipality", municipality);
    formData.append("dateOfBirth", formattedDate); // Include formatted date of birth
    if (citizenshipPhoto) formData.append("citizenshipImage", citizenshipPhoto); // Only add citizenship photo if uploaded

    try {
      // Send the PUT request to update client details
      await axios.put(
        `https://rentoora-backend-rental.onrender.com/admin/update-client/${client.accountId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Client details updated successfully!");
      onClose(); // Close the popup after successful update
      refreshClients(); // Refresh the clients list in parent component
    } catch (error) {
      console.error("Error updating client details:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white overflow-y-auto lg:h-auto h-[85%] p-8 mx-2 rounded-lg shadow-lg max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center">Update Client Details</h3>
        <form onSubmit={handleSubmit}>
          {/* First row with two input fields */}
          <div className="lg:flex lg:space-x-4 mb-4">
            <div className="lg:w-1/2 mb-4">
              <label className="block text-gray-700 mb-1">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="lg:w-1/2">
              <label className="block text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Second row with two input fields */}
          <div className="lg:flex lg:space-x-4 mb-4">
            <div className="lg:w-1/2 mb-4">
              <label className="block text-gray-700 mb-1">Phone No:</label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="lg:w-1/2">
              <label className="block text-gray-700 mb-1">Date of Birth (MM/DD/YYYY):</label>
              <input
                type="text"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Third row with two input fields */}
          <div className="lg:flex lg:space-x-4 mb-4">
            <div className="lg:w-1/2 mb-4">
              <label className="block text-gray-700 mb-1">Province:</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="lg:w-1/2">
              <label className="block text-gray-700 mb-1">District:</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Fourth row with two input fields */}
          <div className="lg:flex lg:space-x-4 mb-4">
            <div className="lg:w-1/2 mb-4">
              <label className="block text-gray-700 mb-1">Municipality:</label>
              <input
                type="text"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="lg:w-1/2 mb-4">
              <label className="block text-gray-700 mb-1">Citizenship Photo:</label>
              <input
                type="file"
                name="citizenshipImage" // Ensure this matches the backend expected field name
                onChange={handleCitizenshipPhotoChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClient;
