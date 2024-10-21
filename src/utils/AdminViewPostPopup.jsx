import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const PostDetailsModal = ({ isOpen, onClose, post }) => {
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    // Set the selected image to the first image when the post changes
    if (post && post.images && post.images.length > 0) {
      setSelectedImage(post.images[0]);
    }
  }, [post]); // Run this effect when the post changes

  if (!post) return null; // Prevent rendering if post is null

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Post Details"
      className="w-full mx-4 md:max-w-lg lg:mx-auto rounded bg-white p-6"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold mb-4">Post Details</h2>
      
      {/* Image Preview */}
      <img
        src={selectedImage}
        alt="Selected Post"
        className="w-full lg:h-60 h-44 mb-4 rounded"
      />

      {/* Thumbnail Images */}
      <div className="flex space-x-2 mb-4">
        {post.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-25 h-25 object-cover cursor-pointer rounded w-12 h-12"
            onClick={() => handleImageClick(image)} // Set selected image on click
          />
        ))}
      </div>

      <p className="font-semibold">Post Type: {post.postType}</p>
      <p>Description: {post.description}</p>
      <p>Price: Rs. {post.price}</p>
      <p>Posted Date: {new Date(post.createdAt).toLocaleDateString()}</p>
      <p>Posted By: {post.clientId?.name || 'N/A'}</p>
      <p>Account ID: {post.clientId?.accountId || 'N/A'}</p>
      
      <div className="flex justify-end mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default PostDetailsModal;
