import React, { useEffect, useState } from "react";
import axios from "axios";
import { PenBoxIcon, XIcon } from "lucide-react";
import manpng from "../assets/img/man.png";
import ProfilePopup from "../Components/ProfilePopup";
import toast from 'react-hot-toast';
import AdminNav from "./adminNav";
import { FaSpinner } from 'react-icons/fa';

const AdminProfile = () => {
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
  const [isLoading, setIsLoading] = useState(true); // New state for loading

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:7000/auth/profile", {
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
      } finally {
        setIsLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchUserData();
  }, []);

  const fetchProfilePhoto = (profilePhotoPath) => {
    axios
      .get(`http://localhost:7000/${profilePhotoPath}`, { responseType: "arraybuffer" })
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
      .get(`http://localhost:7000/${citizenshipImagePath}`, { responseType: "arraybuffer" })
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
      await axios.put("http://localhost:7000/auth/update-user-details", {
        ...details,
        dateOfBirth: new Date(details.dateOfBirth).toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(`${editingField} updated successfully!`);
      setEditingField(null);
      const response = await axios.get("http://localhost:7000/auth/user-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
      fetchProfilePhoto(response.data.profilePhotoPath);
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Error updating details!");
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
    fetchProfilePhoto(details.profilePhotoPath);
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

  return (
    <div className="w-full container mx-auto lg:p-8 text-white bg-brand-bgColor h-fit">
      <AdminNav /> {/* Keep AdminNav visible */}
      <div className="flex flex-col py-1 lg:pl-12 p-4 mt-8 gap-12 md:flex-row overflow-hidden">
        {/* Conditionally render profile content if not loading */}
        {isLoading ? (
          <div className="w-full flex justify-center items-center">
            <FaSpinner className="animate-spin h-8 w-8 text-blue-500 mr-3" />
          </div>
        ) : (
          <>
            {/* Profile Picture Section */}
            <div className="space-y-8 lg:w-[250px] w-full">
              <div className="relative lg:h-64 h-32 lg:w-64 w-32 flex flex-col items-center">
                {profilePhoto ? (
                  <img
                    className="profile-img w-full h-full rounded-2xl object-cover bg-brand-dark border-b-4 border-t-4 border-red-700"
                    src={profilePhoto}
                    alt="Profile"
                  />
                ) : (
                  <img
                    className="profile-img w-full h-full rounded-2xl object-cover bg-brand-dark"
                    src={manpng}
                    alt="Profile"
                  />
                )}
                <label htmlFor="profilePic" className="cursor-pointer text-blue-500 hover:underline">
                  <PenBoxIcon
                    onClick={handleProfilePicClick}
                    className="cursor-pointer absolute bottom-4 right-4 bg-gray-400 lg:w-8 w-6 lg:h-8 h-6 p-1 hover:bg-white text-black rounded-lg"
                  />
                </label>
              </div>

              <div className="bg-brand-Colorpurple rounded">
                <h2 className="py-2 text-center font-sans rounded bg-blue-700">Attached Document *</h2>
                <div className="relative p-2">
                  <img
                    className="profile-img w-full lg:h-44 h-24 object-fit bg-brand-dark blur-sm"
                    src={citizenshipImagePath}
                    alt="Document"
                    onClick={handleImagePreviewClick}
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
                <h2 className="font-bold">
                  Account Type &nbsp;&nbsp;:&nbsp;&nbsp;{" "}
                  <span className="text-blue-300">{user.role === 0 ? "Client" : "Admin"}</span>
                </h2>
              </div>
              <div className="space-y-8">
                {Object.keys(details).map((key) => {
                  if (key === "accountId" || key === "role") return null;

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
                        className={`mt-1 block w-full px-3 py-2 bg-white border ${
                          editingField === key ? "border-blue-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500 sm:text-sm`}
                      />
                      {editingField === key ? (
                        <div className="absolute right-0 flex gap-4 mt-2">
                          <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md"
                          >
                            Save
                          </button>
                          <XIcon onClick={handleCancel} className="cursor-pointer" />
                        </div>
                      ) : (
                        <PenBoxIcon
                          onClick={() => handleEdit(key)}
                          className="absolute right-0 bottom-1.5 w-6 h-6 text-blue-500 cursor-pointer"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      {isPopupOpen && <ProfilePopup onClose={handlePopupClose} onUpload={handleProfilePicUpload} />}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <button
              onClick={handleImagePreviewClose}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <img className="w-full h-full object-cover" src={citizenshipImagePath} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
