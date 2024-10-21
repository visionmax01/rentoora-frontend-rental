import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"; // Ensure this function is correctly defined
import axios from "axios";
import { XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import "react-easy-crop/react-easy-crop.css";
import { FaSpinner } from 'react-icons/fa';

const ProfilePopup = ({ isOpen, onClose, onUpload }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback(
    async (croppedArea, croppedAreaPixels) => {
      try {
        const croppedImg = await getCroppedImg(image, croppedAreaPixels, rotation);
        setCroppedImage(croppedImg);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    },
    [image, rotation]
  );

  const handleUpload = async () => {
    if (!croppedImage) {
      toast.error("Please choose an image for your profile picture");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const blob = await fetch(croppedImage).then((res) => res.blob());
      formData.append("profilePhoto", blob, "profile-pic.jpg");

      const response = await axios.post(
        "https://rentoora-backend-rental.onrender.com/auth/update-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Profile picture updated successfully");
      onUpload(); // Notify parent to refresh profile photo
      onClose(); // Close the popup
    } catch (error) {
      toast.error("Error updating profile picture");
      console.error("Error updating profile picture:", error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateLeft = () => setRotation(rotation - 90);
  const handleRotateRight = () => setRotation(rotation + 90);

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg relative w-full md:w-1/2 mx-2 max-w-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-black">
          <XIcon className="w-6 h-6 hover:text-red-600" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Update Profile Picture</h2>
        <div className="relative mb-4">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <label
            htmlFor="fileInput"
            className="bg-black text-white py-2 px-4 rounded-md cursor-pointer flex items-center justify-center"
          >
            Choose Image
          </label>
        </div>
        <div className="relative w-full h-fit p-8">
          {image && (
            <div className="w-full h-64">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                className="absolute inset-0"
              />
              <div className="absolute bottom-1 left-4 w-full flex items-center">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-3/4 mx-auto"
                />
                <span className="ml-2 absolute">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="absolute bg-opacity-25 left-1 top-1 rounded flex justify-center items-center gap-4 bg-gray-950 px-2 pb-1">
                <button onClick={handleRotateLeft} className="rounded">
                  <p className="text-3xl hover:text-blue-700">⟲</p>
                </button>
                <button onClick={handleRotateRight} className="rounded">
                  <p className="text-3xl hover:text-blue-700">⟳</p>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                Uploading...
              </span>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProfilePopup;
