import React, { useState, useEffect } from "react";
import Api from "../utils/Api.js";

const Step3 = ({
  formData,
  setFormData,
  setProviders,
  providers,
  handleNextStep,
  handlePrevStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    const fetchProviders = async () => {
      if (!formData.serviceType) return;

      setLoading(true);
      try {
        // Fetch service providers based on the service type
        const response = await Api.get(
          `book-provider/display-providers?serviceType=${formData.serviceType}`
        );
        setProviders(response.data); // Save the providers data

        // For each provider, fetch feedbacks and calculate the average rating
        const ratings = {};
        for (const provider of response.data) {
          try {
            const feedbackResponse = await Api.get(
              `/booked/provider-feedbacks/${provider.providerId}`
            );
            ratings[provider.providerId] =
              feedbackResponse.data.averageRating || 0;
          } catch (error) {
            console.error("Error fetching provider feedback:", error);
            ratings[provider.providerId] = 0;
          }
        }
        setAverageRatings(ratings); // Set the average ratings for each provider
      } catch (error) {
        console.error("Error fetching service providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [formData.serviceType, setProviders]);

  const renderStars = (rating) => {
    let fullStars = Math.floor(rating);
    let partialStar = rating - fullStars;
    let stars = [];
    let starColor =
      rating < 1.5
        ? "text-red-500"
        : rating <= 3.5
        ? "text-blue-500"
        : "text-yellow-500";

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${starColor}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 17.75l-5.596 3.126 1.065-6.227-4.526-4.412 6.261-.914 2.796-5.686 2.797 5.686 6.261.914-4.526 4.412 1.065 6.227L12 17.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    // Add partial star
    if (partialStar > 0) {
      stars.push(
        <svg
          key="partial"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${starColor}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient
              id={`partialStar-${partialStar}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="currentColor" />
              <stop offset={`${partialStar * 100}%`} stopColor="currentColor" />
              <stop offset={`${partialStar * 100}%`} stopColor="#D1D5DB" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M12 17.75l-5.596 3.126 1.065-6.227-4.526-4.412 6.261-.914 2.796-5.686 2.797 5.686 6.261.914-4.526 4.412 1.065 6.227L12 17.75z"
            clipRule="evenodd"
            fill={`url(#partialStar-${partialStar})`}
          />
        </svg>
      );
    }

    // Add empty stars
    for (let i = fullStars + (partialStar > 0 ? 1 : 0); i < 5; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 17.75l-5.596 3.126 1.065-6.227-4.526-4.412 6.261-.914 2.796-5.686 2.797 5.686 6.261.914-4.526 4.412 1.065 6.227L12 17.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="w-[95%] px-4 ">
      <h3 className="lg:text-2xl text-md font-bold text-indigo-700">
        Step 3: Choose Service Provider
      </h3>
      <div className="bg-white shadow-lg rounded-lg lg:p-6 ">
        <h1 className="lg:text-xl text-sm font-semibold mb-2 text-gray-700">
          List of Providers in your area!
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 h-[360px]  overflow-y-auto pr-4 lg:grid-cols-3 gap-6">
            {providers.length > 0 ? (
              providers.map((provider) => {
                const providerRating = averageRatings[provider.providerId] || 0;

                return (
                  <div
                    key={provider.providerId}
                    className={`relative rounded-lg h-fit transition-all duration-300 ${
                      formData.providerId === provider.providerId
                        ? "border-2 border-green-500 bg-green-50"
                        : "border-2 border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex  items-center mb-4">
                      <div className="relative mb-6 ">
                        <img
                          src={
                            provider.profilePhotoPath || "/default-avatar.png"
                          }
                          alt={`${provider.name}'s profile`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-400 rounded-full ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {provider.name}
                          </h4>
                          <div className="flex items-center">
                            {renderStars(providerRating)}
                            <span className="ml-2 text-sm font-medium text-gray-600">
                              {providerRating.toFixed(1)} / 5
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded ${
                          formData.providerId === provider.providerId
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {provider.servicesType}
                      </span>
                      <p className="text-sm text-gray-600 mb-1">
                        Experience: {provider.experience} years
                      </p>
                      <p className="lg:text-sm text-[12px] font-bold text-gray-600 mb-3">
                        Working hours: {provider.workingFrom} -{" "}
                        {provider.workingTo}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Rate: ₹{provider.rateCharge}/hr
                      </p>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            providerId: provider._id || provider.providerId,
                            selectedProvider: provider,
                            rateCharge: provider.rateCharge
                          }))
                        }
                        className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${
                          formData.providerId === provider.providerId
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {formData.providerId === provider.providerId
                          ? "Selected"
                          : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No providers found for this service type.
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevStep}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
