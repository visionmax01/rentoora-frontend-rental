import React, { useState, useEffect } from "react";
import Api from "../utils/Api.js";

const Step3 = ({ formData, setFormData, setProviders, providers, handleNextStep, handlePrevStep }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!formData.serviceType) return;

      setLoading(true);
      try {
        const response = await Api.get(
          `book-provider/display-providers?serviceType=${formData.serviceType}`
        );
        setProviders(response.data); 
      } catch (error) {
        console.error("Error fetching service providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [formData.serviceType, setProviders]);

  return (
    <div className="px-2  sm:px-0">
      <h3 className="text-xl font-semibold mb-3">Step 3: Choose Service Provider</h3>
      <div className="border border-black/25 p-4 rounded lg:w-fit lg:h-80 overflow-y-auto">
      <h1>Listed of  provider in your area!</h1>
        {loading ? (
          <div>Loading providers...</div>
        ) : (
          <div className="mt-4 flex flex-wrap flex-col sm:flex-row gap-6">
            {/* Render available providers */}
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div
                  key={provider._id}
                  className={`border relative  shadow-md rounded p-4 ${formData.providerId === provider._id ? "border-2 border-green-600 bg-green-200" : "bg-white"}`}
                  >
                  <h4 className={`absolute text-[12px] font-bold top-1 right-1 px-2 py-1 rounded  ${formData.providerId === provider._id ? "text-black bg-green-300" : "bg-gray-200"}`}>{provider.servicesType}</h4>
                  <h4>{provider.name}</h4>
                  <p>Experience: {provider.experience} years</p>
                  <p>
                    Working hours: {provider.workingFrom} - {provider.workingTo}
                  </p>
                  <button
                    onClick={() => setFormData({ ...formData, providerId: provider._id })}
                    className={`mt-2 px-4 py-2 rounded ${formData.providerId === provider._id ? "bg-green-600 text-white" : "bg-gray-300 text-black"}`}
                  >
                    {formData.providerId === provider._id ? "Selected" : "Select"}
                  </button>
                </div>
              ))
            ) : (
              <div>No providers found for this service type.</div>
            )}
          </div>
        )}

        <div className=" absolute bottom-0 left-6 lg:left-10 gap-6 flex">
          <button
            onClick={handlePrevStep}
            className=" px-4 py-1 bg-gray-400 text-white rounded"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="px-4 py-1 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
