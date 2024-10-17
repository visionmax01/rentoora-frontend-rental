import React, { useEffect, useState } from "react";
import axios from "axios";
import { PenBoxIcon, XIcon } from "lucide-react";
import manpng from "../assets/img/man.png";
import ProfilePopup from "../utils/ProfilePopup";
import toast from 'react-hot-toast';

const ClientProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [citizenshipImagePath, setDocumentePhoto] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phoneNo: "",
    accountId: "",
    province: "",
    district: "",
    municipality: "",
    role: '',
    dateOfBirth: ''
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://rentoora-backend-rental.onrender.com/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        setDetails({
          name: response.data.name,
          email: response.data.email,
          phoneNo: response.data.phoneNo,
          accountId: response.data.accountId,
          province: response.data.province,
          district: response.data.district,
          municipality: response.data.municipality,
          role: response.data.role,
          dateOfBirth: formatDate(response.data.dateOfBirth),
        });
        fetchProfilePhoto(response.data.profilePhotoPath);
        fetchDocumentPhoto(response.data.citizenshipImagePath);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchProfilePhoto = (profilePhotoPath) => {
    axios
      .get(`https://rentoora-backend-rental.onrender.com/${profilePhotoPath}`, { responseType: "arraybuffer" })
      .then((response) => {
        const imageBlob = new Blob([response.data], { type: response.headers["content-type"] });
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfilePhoto(imageUrl);
      })
      .catch((error) => {
        console.log("Error fetching profile photo:", error);
      });
  };

  const fetchDocumentPhoto = (citizenshipImagePath) => {
    axios
      .get(`https://rentoora-backend-rental.onrender.com/${citizenshipImagePath}`, { responseType: "arraybuffer" })
      .then((response) => {
        const imageBlob = new Blob([response.data], { type: response.headers["content-type"] });
        const imageUrl = URL.createObjectURL(imageBlob);
        setDocumentePhoto(imageUrl);
      })
      .catch((error) => {
        console.log("Error fetching document photo:", error);
      });
  };

  const handleEdit = (field) => {
    if (field !== "dateOfBirth") {
      setEditingField(field);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("https://rentoora-backend-rental.onrender.com/auth/update-user-details", {
        ...details,
        dateOfBirth: new Date(details.dateOfBirth).toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(`${editingField} updated successfully!`); // Show toast
      setEditingField(null);
      const response = await axios.get("https://rentoora-backend-rental.onrender.com/auth/user-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
      fetchProfilePhoto(response.data.profilePhotoPath);
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Error updating details!"); // Show error toast
    }
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleProfilePicClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleProfilePicUpload = () => {
    fetchProfilePhoto(details.profilePhotoPath); // Refresh profile photo
  };

  const handleImagePreviewClick = () => {
    setIsImagePreviewOpen(true);
  };

  const handleImagePreviewClose = () => {
    setIsImagePreviewOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!user) return (
    <div className="w-full h-screen flex justify-center items-center text-red-600 mx-auto my-auto">
      Loading...
    </div>
  );

  return (
    <div className="w-full  container mx-auto lg:p-8 p-8 text-white bg-brand-bgColor h-fit ">
      <div className="flex flex-col py-1 lg:pl-12  gap-12 md:flex-row overflow-hidden">
        {/* Profile Picture Section */}
        <div className="space-y-8 lg:w-[250px] w-full ">
          <div className="relative lg:h-64 h-32 lg:w-64 w-32 flex flex-col items-center">
            {profilePhoto ? (
              <img
                className="profile-img  w-full  h-full   rounded-2xl object-cover bg-brand-dark border-b-4 border-t-4 border-red-700"
                src={profilePhoto}
                alt="Profile"
              />
            ) : (
              <img
                className="profile-img  w-full  h-full   rounded-2xl object-cover bg-brand-dark"
                src={manpng}
                alt="Profile"
              />
            )}
            <label
              htmlFor="profilePic"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              <PenBoxIcon
                onClick={handleProfilePicClick}
                className="cursor-pointer absolute bottom-4 right-4 bg-gray-400 lg:w-8 w-6 lg:h-8 h-6 p-1 hover:bg-white text-black rounded-lg"
              />
            </label>
          </div>

          <div className="bg-brand-Colorpurple rounded ">
            <h2 className="py-2 text-center font-sans rounded bg-blue-700">Attached Document *</h2>
            <div className="relative p-2">
              <img
                className="profile-img w-full lg:h-44 h-24 object-fit bg-brand-dark blur-sm"
                src={citizenshipImagePath}
                alt="Document"
                onClick={handleImagePreviewClick} // Open preview on click
              />
              <button
                onClick={handleImagePreviewClick}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
        {/* Personal Details Section */}
        <div className="md:w-1/2 bg-brand-bgColoe space-y-4">
          <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
          <div className="bg-red-100 bg-opacity-25 p-2 lg:text-lg text-[12px] rounded mb-4 flex justify-between">
            <h2 className="font-bold">
              Client ID &nbsp;&nbsp;:&nbsp;&nbsp;{" "}
              <span className="text-blue-300">{details.accountId}</span>
            </h2>
            <h2 className="font-bold">Account Type &nbsp;&nbsp;:&nbsp;&nbsp;{" "}<span className="text-blue-300">{user.role === 0 ? "Client" : "Admin"}</span></h2>
          </div>
          <div className="space-y-8">
            {Object.keys(details).map((key) => {
              if (key === "accountId") return null; // Skip accountId field
              if (key === "role") return null; // Skip role field

              return (
                <div className="relative" key={key}>
                  <label className="block text-sm font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                    <span className="text-red-600"> *</span>
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={key === "dateOfBirth" ? formatDate(details[key]) : details[key]}
                    onChange={handleChange}
                    disabled={editingField !== key}
                    className="py-2 mt-1 block w-full bg-transparent border-b-2 outline-none focus:border-b-blue-500"
                  />
                  {editingField !== key && key !== "dateOfBirth" && (
                    <PenBoxIcon
                      className="absolute hover:text-white bottom-0 p-1 right-0 transform -translate-y-1/2 text-sm text-blue-500 cursor-pointer"
                      onClick={() => handleEdit(key)}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            {editingField && (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            )}
            {editingField && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-4"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      {/* ProfilePopup Component */}
      <ProfilePopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onUpload={handleProfilePicUpload}
      />
      {/* Image Preview Popup (optional) */}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg relative">
            <button
              onClick={handleImagePreviewClose}
              className="absolute top-0 right-0"
            >
              <XIcon className="bg-gray-700 w-6 h-6 p-1 hover:bg-red-600" />
            </button>
            <img
              src={citizenshipImagePath}
              alt="Document Preview"
              className="w-[45vw] h-[30vw]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
