// UpdatePostModal.js
import React, { useState, useEffect } from 'react';

const UpdatePostModal = ({ isOpen, onClose, onUpdate, post }) => {
  const [postType, setPostType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Set initial values when the modal is opened
  useEffect(() => {
    if (isOpen && post) {
      setPostType(post.postType);
      setDescription(post.description);
      setPrice(post.price);
    }
  }, [isOpen, post]);

  const handleUpdate = () => {
    onUpdate({ ...post, postType, description, price }); // Pass updated post data
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-1/2">
        <h2 className="text-lg font-bold">Update Post</h2>
        <div className="mt-4">
          <label className="block mb-1">Rental Type</label>
          <input
            type="text"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter post type"
            disabled
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter description"
            rows="3"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter price"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleUpdate}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostModal;
