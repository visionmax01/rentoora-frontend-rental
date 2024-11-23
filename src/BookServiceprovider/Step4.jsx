import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Step4 = ({ formData, setFormData, handleNextStep, handlePrevStep, providers }) => {
  const [availableSlots, setAvailableSlots] = useState([]);  // To store available time slots
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // To store the selected time slot
  const [selectedDate, setSelectedDate] = useState(formData.bookingDate); // To store the selected date
  const [isValidDateTime, setIsValidDateTime] = useState(false);  // Add this state

  // Effect to generate available time slots once the provider is selected and working hours are available
  useEffect(() => {
    const provider = formData.selectedProvider || providers.find((p) => p._id === formData.providerId);
    
    if (provider && provider.workingFrom && provider.workingTo) {
      const slots = generateAvailableTimeSlots(provider.workingFrom, provider.workingTo);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]); // Clear slots if no provider is selected
    }
  }, [formData.providerId, formData.selectedProvider, providers]); // Re-run when provider changes

  // Convert 12-hour time (e.g., "12:00 AM", "05:00 PM") to 24-hour format
  const convertTo24HourFormat = (time) => {
    const [hoursMinutes, period] = time.split(' ');
    let [hours, minutes] = hoursMinutes.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  // Generate time slots based on provider's working hours (from 12:00 AM to 5:00 PM, for example)
  const generateAvailableTimeSlots = (workingFrom, workingTo) => {
    const slots = [];

    // Convert workingFrom and workingTo from 12-hour format to 24-hour format
    const start = convertTo24HourFormat(workingFrom);
    const end = convertTo24HourFormat(workingTo);

    // Create Date objects using the fixed date with the converted time
    const startDate = new Date(`2023-01-01T${start}`);
    const endDate = new Date(`2023-01-01T${end}`);

    // Generate 1-hour time slots between the working hours
    while (startDate < endDate) {
      const timeSlot = `${formatTime(startDate)} - ${formatTime(new Date(startDate.setHours(startDate.getHours() + 1)))}`;
      slots.push(timeSlot);

      startDate.setHours(startDate.getHours() + 1); // Increment by 1 hour
    }

    return slots;
  };

  // Helper function to format the Date object as "10:00 AM" or "8:00 PM"
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const ampm = hours < 12 ? 'AM' : 'PM';
    const hour12 = hours % 12 || 12; // Convert to 12-hour format (1-12)
    const formattedMinutes = minutes === 0 ? '00' : minutes; // Format minutes if needed

    return `${hour12}:${formattedMinutes} ${ampm}`;
  };

  // Updated handleDateChange function
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);

    // Check if the selected date is in the past
    if (selectedDateObj < now.setHours(0, 0, 0, 0)) {
      toast.error("You can't book for a past date!");
      setIsValidDateTime(false);
      return; // Don't update the state if date is invalid
    }
    
    setSelectedDate(selectedDate);
    setFormData({
      ...formData,
      bookingDate: selectedDate,
    });
    
    // Revalidate time slot if one is selected
    if (formData.timeSlot) {
      validateTimeSlot(formData.timeSlot, selectedDate);
    } else {
      setIsValidDateTime(true);
    }
  };

  // Add this helper function
  const validateTimeSlot = (slot, date) => {
    const now = new Date();
    const selectedDate = new Date(date);
    
    const startTime = slot.split(' - ')[0];
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':');
    
    const selectedDateTime = new Date(selectedDate);
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    selectedDateTime.setHours(hour, parseInt(minutes), 0, 0);

    setIsValidDateTime(selectedDateTime > now);
    return selectedDateTime > now;
  };

  // Updated handleTimeSlotChange function
  const handleTimeSlotChange = (e) => {
    const selectedSlot = e.target.value;
    
    if (!validateTimeSlot(selectedSlot, formData.bookingDate)) {
      toast.error("You can't book a past time slot!");
      return; // Don't update the state if time is invalid
    }

    setSelectedTimeSlot(selectedSlot);
    setFormData({
      ...formData,
      timeSlot: selectedSlot,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="lg:w-full max-w-2xl px-4 py-8"
    >
      <motion.h3 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:text-2xl text-md font-bold mb-6 text-indigo-700"
      >
        Step 4: Select Booking Date & Time Slot
      </motion.h3>
      
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
      >
        {/* Booking Date Input */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 relative"
        >
          <label htmlFor="bookingDate" className="block text-lg font-semibold text-gray-800 mb-3">
            Select Booking Date
          </label>
          <input
            type="date"
            id="bookingDate"
            value={selectedDate || ''}
            onChange={handleDateChange}
            onClick={(e) => e.target.showPicker()}
            className="w-full p-4 text-gray-700 bg-white border-2 border-indigo-200 rounded-lg 
            shadow-sm hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 
            focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200
            placeholder-gray-400 outline-none cursor-pointer"
          />
        </motion.div>

        {/* Time Slot Selection */}
        {availableSlots.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot
            </label>
            <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSlots.map((slot, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTimeSlotChange({ target: { value: slot } })}
                  className={`p-3 text-[9px] font-bold lg:text-sm rounded-md transition-all ${
                    formData.timeSlot === slot 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  } border border-gray-200`}
                >
                  {slot}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* No slots message */}
        {availableSlots.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
          >
            No available time slots for the selected provider.
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevStep}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-150 ease-in-out"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={formData.bookingDate && formData.timeSlot && isValidDateTime ? { scale: 1.05 } : {}}
            whileTap={formData.bookingDate && formData.timeSlot && isValidDateTime ? { scale: 0.95 } : {}}
            onClick={handleNextStep}
            className={`px-6 py-2 rounded-md transition duration-150 ease-in-out ${
              formData.bookingDate && formData.timeSlot && isValidDateTime
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!formData.bookingDate || !formData.timeSlot || !isValidDateTime}
          >
            Next
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Step4;
