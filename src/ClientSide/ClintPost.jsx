import React, { useState } from "react";
import Api from '../utils/Api.js'
import { toast } from "react-toastify";
import { locationData } from "../utils/LocationData";
import { FaSpinner } from "react-icons/fa";

function ClientPost() {
  const [loadingPost, setLoadingPost] = useState(false); // Correct state initialization
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

  const maxFileSize = 200 * 1024; // 200KB

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const { type, description, price, province, district, municipality,landmark } = formData;
    if (!type || !description || !price || !province || !district || !municipality || !landmark) {
      toast.error('Please fill out all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (
      (formData.image1 && formData.image1.size > maxFileSize) ||
      (formData.image2 && formData.image2.size > maxFileSize) ||
      (formData.image3 && formData.image3.size > maxFileSize)
    ) {
      toast.error("Each image must be less than 200KB");
      return;
    }

    const data = new FormData();
    data.append("type", formData.type);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("province", formData.province);
    data.append("district", formData.district);
    data.append("municipality", formData.municipality);
    data.append("landmark", formData.landmark);
    if (formData.image1) data.append("images", formData.image1);
    if (formData.image2) data.append("images", formData.image2);
    if (formData.image3) data.append("images", formData.image3);

    try {
      const token = localStorage.getItem("token");
      setLoadingPost(true);
      await Api.post("api/post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Post created successfully!");
      // Reset the form after successful submission
      setFormData({
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
      setPreviews({
        image1: null,
        image2: null,
        image3: null,
      });
    } catch (error) {
      console.log.error("Error creating post");
    } finally {
      setLoadingPost(false);
    }
  };
  const formatDescription = (description) => {
    const chunks = description
      .split(",")
      .map((chunk, index) => `${index + 1}. ${chunk.trim()}`);
    return chunks.join("\n");
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

  return (
    <div className="w-full h-screen bg-brand-bgColor pb-8 overflow-y-auto lg:px-4 pt-4">
      <div className="lg:w-[85%] ml-1 w-full mx-auto">
        <h1 className="lg:text-2xl text-md font-extrabold text-center mb-6">
          Post Your Room, Apartment, or House For Rent
        </h1>
        <div className="lg:flex w-full lg:gap-6 pr-2">
          {/* Form Part 1 - Basic Info */}
          <form onSubmit={handleSubmit}  className="lg:flex w-full lg:gap-6 pr-2">
          <div className="bg-gray-700 p-6 rounded-lg mb-6 lg:w-1/2">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block border-blue-500 w-full bg-transparent focus:border-red-600 border outline-none text-white rounded-sm p-2"
                  >
                    <option className="text-black" value="Room">
                      Room
                    </option>
                    <option className="text-black" value="Apartment">
                      Apartment
                    </option>
                    <option className="text-black" value="House">
                      House
                    </option>
                    <option className="text-black" value="Mobile">
                      Mobile
                    </option>
                    <option className="text-black" value="Laptop">
                      Laptop
                    </option>
                    <option className="text-black" value="Other Electooni">
                      Other Electoonic
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-transparent focus:border-red-600 border outline-none border-gray-300 text-white rounded-sm p-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-transparent focus:border-red-600 border outline-none border-gray-300 text-white rounded-sm p-2"
                  rows="4"
                ></textarea>

                <div className="mt-4">
                  <h3 className="font-bold mb-1 text-white">
                    Formatted Description Preview:
                  </h3>
                  <pre className="bg-gray-900 h-[150px] overflow-y-auto overflow-x-hidden p-3 rounded-lg text-blue-400 whitespace-pre-wrap">
                    {formatDescription(formData.description)}
                  </pre>
                </div>
              </div>

          </div>

          {/* Form Part 2 - Location and Images */}
          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Location and Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="province" className="block text-sm font-medium">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-transparent focus:border-red-600 border outline-none border-gray-300 text-white rounded-sm p-2"
                >
                  <option className="text-gray-300" value="">
                    Select Province
                  </option>
                  {locationData.map((prov) => (
                    <option
                      className="text-black"
                      key={prov.name}
                      value={prov.name}
                    >
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.province && (
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium"
                  >
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-transparent focus:border-red-600 border outline-none border-gray-300 text-white rounded-sm p-2"
                  >
                    <option className="text-gray-300" value="">
                      Select District
                    </option>
                    {getDistricts().map((dist) => (
                      <option
                        className="text-black"
                        key={dist.name}
                        value={dist.name}
                      >
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.district && (
                <div>
                  <label
                    htmlFor="municipality"
                    className="block text-sm font-medium"
                  >
                    Municipality
                  </label>
                  <select
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-transparent focus:border-red-600 border outline-none text-white rounded-sm p-2"
                  >
                    <option className="text-gray-300" value="">
                      Select Municipality
                    </option>
                    {getMunicipalities().map((mun) => (
                      <option className="text-black" key={mun} value={mun}>
                        {mun}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            {/* Landmark Field */}
             <div className="">
              <label htmlFor="landmark" className="block text-sm font-medium">
                Location Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="mt-1 block w-full bg-transparent focus:border-red-600 border outline-none border-gray-300 text-white rounded-sm p-2"
              />
            </div>
            </div>

            

            {/* Image Upload Section */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-4">Upload Images - SIZE LIMIT : 200KB</h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[1, 2, 3].map((index) => (
      <div key={index}>
        <label
          htmlFor={`image${index}`}
          className="block text-sm font-medium mb-2"
        >
          Image {index}
        </label>
        {/* Styled Container acting as a clickable input area */}
        <label
          htmlFor={`image${index}`}
          className="relative w-full h-32 border-2 border-dashed border-white rounded-lg cursor-pointer flex items-center justify-center bg-gray-800 text-white hover:border-red-600 transition-colors"
        >
          {previews[`image${index}`] ? (
            <img
              src={previews[`image${index}`]}
              alt={`Preview ${index}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-center ">Please choose an image</div>
          )}
          <input
            id={`image${index}`}
            type="file"
            name={`image${index}`}
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>
    ))}
  </div>
</div>


            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                className="relative w-full text-center py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
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
          </form>



        </div>
      </div>
    </div>
  );
}

export default ClientPost;
