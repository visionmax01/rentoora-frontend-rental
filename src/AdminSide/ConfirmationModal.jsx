// ConfirmationModal.js
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isdeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this post?</p>
        <div className="mt-4">
          <button
            onClick={onConfirm}
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isdeleting} // Disable button while deleting
          >
            {isdeleting ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            disabled={isdeleting} 
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
