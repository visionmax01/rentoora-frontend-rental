import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientHomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://rentoora-backend-rental.onrender.com/auth/user-data",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
        setTimeout(() => setLoading(false), 2000); // 2-second delay to simulate loading
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Dependency array to ensure it only runs once

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-auto lg:h-screen py-4 bg-gray-100">
      {/* Header */}
      <div className="text-black text-center py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
          {user && <p className="text-lg">Hi, {user.name}!</p>}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              Recent Activity
            </h3>
            <p className="text-gray-600">
              View your recent activity and track progress.
            </p>
            <button
              onClick={() => navigate("#")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Activity
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              Profile Settings
            </h3>
            <p className="text-gray-600">
              Manage your account settings and update personal details.
            </p>
            <button
              onClick={() => navigate("#")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Edit Profile
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              Messages
            </h3>
            <p className="text-gray-600">
              Check your latest messages and stay updated.
            </p>
            <button
              onClick={() => navigate("#")}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              View Messages
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Dashboard Overview
          </h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-600">
              This dashboard provides an overview of your activity and settings.
              Use the cards above to quickly navigate to different sections.
            </p>
            <p className="mt-4 text-gray-600">
              For more details, explore the menu on the left to manage your
              account, check updates, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHomePage;
