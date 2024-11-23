import React, { useState, useEffect } from 'react';
import Api from '../../utils/Api.js';
import { toast } from 'react-toastify';

// Utility functions (convert time)
const convertTo24Hour = (time12) => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const formatTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // Handle midnight case
  return `${hour}:${minutes} ${ampm}`;
};

const ModifyBookingModal = ({ booking, onClose, onUpdate, error, setError }) => {
  // Format the initial date properly
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [newDate, setNewDate] = useState(formatDateForInput(booking.bookingDate));
  const [startTime, setStartTime] = useState(convertTo24Hour(booking.timeSlot.split(' - ')[0]));
  const [endTime, setEndTime] = useState(convertTo24Hour(booking.timeSlot.split(' - ')[1]));
  const [newStatus, setNewStatus] = useState(booking.bookingStatus);
  const [isLoading, setIsLoading] = useState(false);  // Track loading state

  useEffect(() => {
    setNewDate(formatDateForInput(booking.bookingDate));
    const [start, end] = booking.timeSlot.split(' - ');
    setStartTime(convertTo24Hour(start));
    setEndTime(convertTo24Hour(end));
    setNewStatus(booking.bookingStatus);
  }, [booking]);

  const handleModifyBooking = async () => {
    if (!newDate || !startTime || !endTime || !newStatus) {
      setError('Please fill in all fields');
      return;
    }

    const formattedStartTime = formatTo12Hour(startTime);
    const formattedEndTime = formatTo12Hour(endTime);
    const formattedTimeSlot = `${formattedStartTime} - ${formattedEndTime}`;

    try {
      setIsLoading(true); // Set loading to true when request starts

      await Api.post(`/booked/booking/modify/${booking.bookingId}`, {
        bookingDate: newDate,
        timeSlot: formattedTimeSlot,
        bookingStatus: newStatus,
      });

      // Update the bookings list with the new values
      onUpdate({ ...booking, bookingDate: newDate, timeSlot: formattedTimeSlot, bookingStatus: newStatus });

      // Show a success toast
      toast.success('Booking updated successfully!')

      onClose(); // Close the modal after successful update
    } catch (err) {
      setError('Error modifying booking');
    } finally {
      setIsLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white text-black rounded-lg shadow-lg p-6 w-1/3">
        <h3 className="text-xl font-semibold mb-4">Modify Booking</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            style={{
              color: newStatus === 'Pending' ? '#2563EB' : 
                    newStatus === 'Confirmed' ? '#16A34A' :
                    '#CA8A04'
            }}
          >
            <option value="Pending" style={{color: '#2563EB'}}>Pending</option>
            <option value="Confirmed" style={{color: '#16A34A'}}>Confirmed</option>
            <option value="Completed" style={{color: '#CA8A04'}}>Completed</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={handleModifyBooking}
            disabled={isLoading} // Disable button while loading
            className={`bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyBookingModal;
