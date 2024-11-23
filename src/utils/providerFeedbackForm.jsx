import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Api from './Api.js';
import { toast } from 'react-toastify';
import mainLogo from '../assets/img/Main_logo.png';

const ProviderFeedbackForm = () => {
  const { bookingId } = useParams();

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [serviceQuality, setServiceQuality] = useState('Good');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('Extracted bookingId:', bookingId);
  }, [bookingId]);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleServiceQualityChange = (e) => {
    setServiceQuality(e.target.value);
  };

  const validateForm = () => {
    if (rating === 0) {
      toast.error('Please select a rating!');
      return false;
    }
    if (!message.trim()) {
      toast.error('Please provide a message!');
      return false;
    }
    if (!serviceQuality) {
      toast.error('Please select a service quality!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log({
      bookingId,
      rating,
      message,
      serviceQuality,
    });

    try {
      const response = await Api.post('/booked/feedback', {
        bookingId,
        rating: Number(rating),
        message,
        serviceQuality,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess('Feedback submitted successfully!');
      setError('');
      toast.success('Feedback submitted successfully!');
    } catch (error) {
      console.log(error.response);
      setError(error.response?.data?.message || 'An error occurred');
      setSuccess('');
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen   flex items-center justify-center px-2">
      <div className="max-w-md w-full space-y-2 bg-white border-2 border-gray-200 p-6 rounded-xl shadow-2xl">
        <div className="text-center">
          <img className="mx-auto h-14 w-auto" src={mainLogo} alt="Main Logo" />
          <h2 className="mt-3 lg:text-3xl text-2xl font-extrabold text-gray-900">
            Submit Feedback
          </h2>
          <p className="mt-2 text-md text-gray-600">
            We value your opinion!
          </p>
        </div>
        <hr />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Quality:</label>
              <div className="flex justify-between">
                {['Poor', 'Good', 'Excellent'].map((quality) => (
                  <label key={quality} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="serviceQuality"
                      value={quality}
                      checked={serviceQuality === quality}
                      onChange={handleServiceQualityChange}
                      className="form-radio h-4 w-4 text-yellow-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 text-sm">{quality}</span>
                  </label>
                ))}
              </div>
               <hr className='my-4' />

            </div>
            <div className="mb-4">
              <label className="block text-sm  font-semibold text-gray-700 mb-2">Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Your feedback..."
              />
            </div>
            <hr />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating:</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    onClick={() => handleStarClick(star)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 17.75l-5.596 3.126 1.065-6.227-4.526-4.412 6.261-.914 2.796-5.686 2.797 5.686 6.261.914-4.526 4.412 1.065 6.227L12 17.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 hover:scale-105  transition duration-150 ease-in-out"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderFeedbackForm;
