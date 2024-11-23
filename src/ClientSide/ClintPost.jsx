import React, { useState, useEffect } from "react";
import Api from "../utils/Api.js";
import { toast } from "react-toastify";
import { locationData } from "../utils/LocationData";
import { FaSpinner, FaInfoCircle } from "react-icons/fa";

function ClientPost() {
  const [loadingPost, setLoadingPost] = useState(false);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({
    province: "",
    district: "",
    municipality: "",
  });
  const [savedNewAddress, setSavedNewAddress] = useState("");
  const [addressChoice, setAddressChoice] = useState("current");
  const [formData, setFormData] = useState({
    type: "Room",
    description: "",
    price: "",
    province: "",
    district: "",
    municipality: "",
    landmark: "",
    image1: null,
    image2: null,
    image3: null,
  });
  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
  });
  const [descriptionPreview, setDescriptionPreview] = useState([]);

  const maxFileSize = 200 * 1024;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await Api.get("auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        setAddress(
          `${response.data.province}, ${response.data.district}, ${response.data.municipality}`
        );
        setFormData({
          ...formData,
          province: response.data.province,
          district: response.data.district,
          municipality: response.data.municipality,
        });
      } catch (error) {
        console.log("Error fetching user profile:", error);
        toast.error("Failed to fetch user data.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "description") {
      const formattedDescription = value
        .split(",")
        .map((chunk, index) => `${index + 1}. ${chunk.trim()}`);
      setDescriptionPreview(formattedDescription);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    if (file && file.size > maxFileSize) {
      toast.error(`Image size for ${name} should be less than 200KB`);
      return;
    }

    setFormData({ ...formData, [name]: file });
    setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
  };

  const validateForm = () => {
    const { type, description, price, landmark, image1 } = formData;

    if (!type || !description || !price || !landmark || !image1) {
      toast.error("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const postAddress =
      addressChoice === "current"
        ? {
            province: formData.province,
            district: formData.district,
            municipality: formData.municipality,
          }
        : {
            province: newAddress.province,
            district: newAddress.district,
            municipality: newAddress.municipality,
          };

    console.log("Address being sent to backend: ", postAddress);

    const data = new FormData();
    data.append("type", formData.type);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("landmark", formData.landmark);
    data.append("address", JSON.stringify(postAddress));

    if (formData.image1) data.append("images", formData.image1);
    if (formData.image2) data.append("images", formData.image2);
    if (formData.image3) data.append("images", formData.image3);

    try {
      const token = localStorage.getItem("token");
      setLoadingPost(true);
      const response = await Api.post("api/post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response from backend:", response.data);
      toast.success("Post created successfully!");

      setFormData({
        type: "",
        description: "",
        price: "",
        province: "",
        district: "",
        municipality: "",
        landmark: "",
        image1: null,
        image2: null,
        image3: null,
      });
      setNewAddress({ province: "", district: "", municipality: "" });
      setSavedNewAddress("");
    } catch (error) {
      console.log("Error creating post", error);
    } finally {
      setLoadingPost(false);
    }
  };

  const getDistricts = () => {
    const province = locationData.find(
      (prov) => prov.name === formData.province
    );
    return province ? province.districts : [];
  };

  const getMunicipalities = () => {
    const districts = getDistricts();
    const district = districts.find((dist) => dist.name === formData.district);
    return district
      ? [...district.municipalities, ...district.ruralMunicipalities]
      : [];
  };

  const handleAddAddress = () => {
    const formattedAddress = `${newAddress.province}, ${newAddress.district}, ${newAddress.municipality}`;
    setSavedNewAddress(formattedAddress);
    setShowAddAddressPopup(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r px-3 from-blue-100 to-purple-100 pb-8 overflow-y-auto lg:px-4 pt-4">
      <div className="lg:w-[90%] w-full mx-auto">
        <h1 className="lg:text-3xl text-md font-extrabold mb-8 ml-2 text-gray-800">
          Post Your Room, Apartment, or House For Rent
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-lg lg:p-6 p-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Basic Information</h2>
            <div className="space-y-6">
              <div className="flex lg:flex-row items-center justify-center flex-col gap-4">
                <div className="lg:w-1/2 w-full">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  >
                    <option value="Room">Room</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Laptop">Laptop</option>
                  </select>
                </div>
                <div className="lg:w-1/2 w-full">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 ">
                    Price (NPR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    placeholder="Enter price"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-500 text-[12px]">(add coma after one sentance like :- single seater, double seater, AC, Non AC, Wifi, etc. )</span>
                  <span className="relative inline-block group ml-1">
                    <FaInfoCircle className="text-blue-500 cursor-help" />
                    <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 -mt-24 -ml-16 w-64">
                      Write a detailed description including:
                      single seater, double seater, AC, Non AC, Wifi, etc.
                      Add comma (,) to separate the features
                    </span>
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  placeholder="write like this: single seater, double seater, AC, Non AC, Wifi, etc."
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Description Preview:</h3>
                <ul className="bg-gray-100 p-3 text-gray-900 rounded-md h-44 overflow-y-auto">
                  {descriptionPreview.length > 0 ? (
                    descriptionPreview.map((item, index) => (
                      <li key={index} className="mb-1">{item}</li>
                    ))
                  ) : (
                    <li>No description preview available</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-lg lg:p-6 p-2">
            <h2 className="lg:text-2xl text-lg font-bold mb-6 text-gray-700">Location and Images</h2>
            <div className="space-y-2">
              <div>
                <p className="lg:text-lg text-md font-medium text-gray-700 mb-2">Current Address:</p>
                <label className="flex items-center space-x-2 bg-blue-100 p-2 rounded">
                  <input
                    type="radio"
                    name="address"
                    value="current"
                    checked={addressChoice === "current"}
                    onChange={() => setAddressChoice("current")}
                    className="form-radio text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-gray-800 text-sm lg:text-md">{address || "No address selected"}</span>
                </label>
              </div>

              <div>
                <p className="lg:text-lg text-md font-medium text-gray-700 mb-2">New Address:</p>
                {savedNewAddress && (
                  <label className="flex items-center space-x-2 bg-blue-100 p-2 rounded mb-2">
                    <input
                      type="radio"
                      name="address"
                      value="new"
                      checked={addressChoice === "new"}
                      onChange={() => setAddressChoice("new")}
                      className="form-radio text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-gray-800 text-sm lg:text-md">{savedNewAddress}</span>
                  </label>
                )}
                <button
                  onClick={() => setShowAddAddressPopup(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Add New Address
                </button>
              </div>

              {showAddAddressPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg w-96">
                    <h3 className="text-xl font-bold mb-4">Add New Address</h3>
                    <div className="space-y-4">
                      <select
                        name="province"
                        value={newAddress.province}
                        onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select Province</option>
                        {locationData.map((province) => (
                          <option key={province.name} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      <select
                        name="district"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select District</option>
                        {newAddress.province &&
                          locationData
                            .find((p) => p.name === newAddress.province)
                            .districts.map((district) => (
                              <option key={district.name} value={district.name}>
                                {district.name}
                              </option>
                            ))}
                      </select>
                      <select
                        name="municipality"
                        value={newAddress.municipality}
                        onChange={(e) => setNewAddress({ ...newAddress, municipality: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select Municipality</option>
                        {newAddress.district &&
                          locationData
                            .find((p) => p.name === newAddress.province)
                            .districts.find((d) => d.name === newAddress.district)
                            .municipalities.map((municipality) => (
                              <option key={municipality} value={municipality}>
                                {municipality}
                              </option>
                            ))}
                      </select>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={handleAddAddress}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setShowAddAddressPopup(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  placeholder="Enter landmark (e.g., Durga Mandir)"
                />
              </div>

              <div>
                <h3 className="lg:text-lg text-sm font-semibold mb-2 text-gray-700">Upload Images - SIZE LIMIT: 200KB</h3>
                <hr className="my-2" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index}>
                      <label htmlFor={`image${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Image {index}
                      </label>
                      <label
                        htmlFor={`image${index}`}
                        className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none"
                      >
                        {previews[`image${index}`] ? (
                          <img
                            src={previews[`image${index}`]}
                            alt={`Preview ${index}`}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center text-gray-500">Choose an image</div>
                        )}
                        <input
                          id={`image${index}`}
                          type="file"
                          name={`image${index}`}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer focus:outline-none"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {loadingPost ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 inline" />
                      Posting...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientPost;
