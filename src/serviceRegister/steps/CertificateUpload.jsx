import React, { useState, useEffect } from 'react';

const CertificateUpload = ({ formData, handleChange, handleNext, handlePrev }) => {
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')) {
      handleChange({ certificate: file });
      setSelectedFile(URL.createObjectURL(file)); // Create a URL for the selected file
      setError('');
    } else {
      setError('Please upload a valid image or PDF file.');
      setSelectedFile(null); // Clear the preview if the file is invalid
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile); // Clean up the object URL
      }
    };
  }, [selectedFile]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Certificate</h2>
      <input type="file" onChange={handleFileChange} className="input mb-4 w-full" />
      
      {error && <p className="text-red-600">{error}</p>} {/* Error message */}
      
      {selectedFile && (
        <div className="mb-4">
          <h3 className="font-semibold">Selected Certificate Preview:</h3>
          <img src={selectedFile} alt="Certificate Preview" className="mt-2 h-72 w-44 object-cover" />
        </div>
      )}

      <div className="absolute bottom-2 right-6 gap-12 flex justify-between">
        <button onClick={handlePrev} className="btn bg-gray-400 rounded px-6 py-2 hover:bg-gray-500">Previous</button>
        <button onClick={handleNext} className="btn bg-blue-500 rounded px-6 py-2 hover:bg-blue-600 text-white">Next</button>
      </div>
    </div>
  );
};

export default CertificateUpload;
