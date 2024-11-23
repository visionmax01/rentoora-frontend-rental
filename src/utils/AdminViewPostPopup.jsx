import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PostDetailsModal = ({ isOpen, onClose, post }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (post && post.images && post.images.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [post]);

  if (!post) return null;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => 
      (prevIndex + 1) % post.images.length
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      (prevIndex - 1 + post.images.length) % post.images.length
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Post Details"
      className="w-full h-full sm:w-11/12 sm:h-auto md:w-4/5 lg:w-2/3 xl:w-1/2 mx-auto my-8 sm:my-16 bg-white rounded-lg shadow-2xl overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative flex flex-col h-full"
      >
        <button
          onClick={onClose}
          className="bg-gray-300 absolute top-2 right-2 text-red-600 hover:text-red-300 px-4 py-2 rounded"
        >
          x
        </button>

        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Post Details</h2>

          <div className="lg:flex lg:space-x-6">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <div className="relative">
                <motion.img
                  key={selectedImageIndex}
                  src={post.images[selectedImageIndex]}
                  alt={`Selected Post ${selectedImageIndex + 1}`}
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                >
                  <FaChevronRight size={20} />
                </button>
              </div>

              <div className="flex space-x-2 mt-6 py-2 overflow-x-auto pb-2">
                {post.images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-10 h-10 object-cover cursor-pointer rounded-md ${
                      index === selectedImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleImageClick(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-3 text-gray-700">
              <p className="font-semibold text-lg">Post Type: <span className="font-normal">{post.postType}</span></p>
              <p className="font-semibold text-lg">Description: <span className="font-normal">{post.description}</span></p>
              <p className="font-semibold text-lg">Price: <span className="font-normal text-green-600">Rs. {post.price}</span></p>
              <p className="font-semibold text-lg">Posted Date: <span className="font-normal">{new Date(post.createdAt).toLocaleDateString()}</span></p>
              <p className="font-semibold text-lg">Posted By: <span className="font-normal">{post.clientId?.name || "N/A"}</span></p>
              <p className="font-semibold text-lg">Account ID: <span className="font-normal">{post.clientId?.accountId || "N/A"}</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default PostDetailsModal;
