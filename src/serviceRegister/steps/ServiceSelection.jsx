import React, { useState } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

// Custom TimePicker Component
const TimePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('07');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const pickerRef = React.useRef(null);

  React.useEffect(() => {
    if (value) {
      const [time, meridiem] = value.split(' ');
      const [hour, minute] = time.split(':');
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setPeriod(meridiem);
    }
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );
  
  const minutes = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, '0')
  );

  const handleTimeSelect = (hour, minute, newPeriod) => {
    const formattedTime = `${hour}:${minute} ${newPeriod}`;
    onChange(formattedTime);
  };

  const incrementHour = () => {
    const currentIndex = hours.indexOf(selectedHour);
    const nextHour = hours[(currentIndex + 1) % hours.length];
    setSelectedHour(nextHour);
    handleTimeSelect(nextHour, selectedMinute, period);
  };

  const decrementHour = () => {
    const currentIndex = hours.indexOf(selectedHour);
    const prevHour = hours[(currentIndex - 1 + hours.length) % hours.length];
    setSelectedHour(prevHour);
    handleTimeSelect(prevHour, selectedMinute, period);
  };

  const incrementMinute = () => {
    const currentIndex = minutes.indexOf(selectedMinute);
    const nextMinute = minutes[(currentIndex + 1) % minutes.length];
    setSelectedMinute(nextMinute);
    handleTimeSelect(selectedHour, nextMinute, period);
  };

  const decrementMinute = () => {
    const currentIndex = minutes.indexOf(selectedMinute);
    const prevMinute = minutes[(currentIndex - 1 + minutes.length) % minutes.length];
    setSelectedMinute(prevMinute);
    handleTimeSelect(selectedHour, prevMinute, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    handleTimeSelect(selectedHour, selectedMinute, newPeriod);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className="flex items-center border rounded-md p-2 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Clock className="w-4 h-4 mr-2 text-gray-500" />
        <span>{`${selectedHour}:${selectedMinute} ${period}`}</span>
      </div>

      {isOpen && (
        <div className="absolute   mt-2 p-4 bg-gray-900 rounded-lg shadow-lg z-50 w-64">
          <div className="flex gap-1 justify-between items-center mb-2">
            <div className="flex-1 text-center">
              <div className="flex flex-col items-center bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={incrementHour}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <span className="text-2xl text-purple-400 font-bold my-2">
                  {selectedHour}
                </span>
                <button 
                  onClick={decrementHour}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            </div>
            <span className="text-4xl text-white mx-2">:</span>
            <div className="flex-1 text-center ">
              <div className="flex flex-col  items-center bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={incrementMinute}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <span className="text-2xl text-white font-bold my-2">
                  {selectedMinute}
                </span>
                <button 
                  onClick={decrementMinute}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 ml-8 -mt-2 text-center">
              <button
                onClick={togglePeriod}
                className={`w-full p-2 rounded ${
                  period === 'AM' ? 'bg-purple-600  text-white' : 'bg-gray-700 text-gray-300'
                } hover:bg-purple-700 mb-2`}
              >
                AM
              </button>
              <button
                onClick={togglePeriod}
                className={`w-full p-2 rounded ${
                  period === 'PM' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                } hover:bg-purple-700`}
              >
                PM
              </button>
            </div>
          </div>
          <p className="py-2"><p className=" bg-purple-700 h-0.5 w-full" ></p></p>
             
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main ServiceSelection Component
const ServiceSelection = ({ formData, handleChange, handleNext, handlePrev }) => {
  const [workingFrom, setWorkingFrom] = useState(formData.workingFrom || '00:00 AM');
  const [workingTo, setWorkingTo] = useState(formData.workingTo || '00:00 PM');

  const handleFromChange = (value) => {
    setWorkingFrom(value);
    handleChange({ workingFrom: value });
  };

  const handleToChange = (value) => {
    setWorkingTo(value);
    handleChange({ workingTo: value });
  };

  const validateForm = () => {
    if (!formData.serviceType) {
      alert('Please select a service type');
      return false;
    }
    if (!formData.workingFrom || !formData.workingTo) {
      alert('Please select working hours');
      return false;
    }
    if (!formData.experience) {
      alert('Please enter your years of experience');
      return false;
    }
    return true;
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Your Service Type!</h2>

      {/* Service Type Selection */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center h-12 w-full sm:w-64 rounded-lg pl-4 bg-red-100 hover:bg-red-200 transition-colors">
          <input
            type="checkbox"
            id="electrician"
            name="serviceType"
            value="Electrician"
            checked={formData.serviceType === 'Electrician'}
            onChange={() => handleChange({ serviceType: 'Electrician' })}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="electrician" className="ml-3 text-gray-700">Electrician</label>
        </div>

        <div className="flex items-center h-12 w-full sm:w-64 rounded-lg pl-4 bg-red-100 hover:bg-red-200 transition-colors">
          <input
            type="checkbox"
            id="plumber"
            name="serviceType"
            value="Plumber"
            checked={formData.serviceType === 'Plumber'}
            onChange={() => handleChange({ serviceType: 'Plumber' })}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="plumber" className="ml-3 text-gray-700">Plumber</label>
        </div>
      </div>

      {/* Working Hours Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Working Hours</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-600">From:</label>
            <TimePicker
              value={workingFrom}
              onChange={handleFromChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-600">To:</label>
            <TimePicker
              value={workingTo}
              onChange={handleToChange}
            />
          </div>
        </div>
      </div>

      {/* Experience Input */}
      <div className="mb-8">
        <label className="block text-lg font-semibold mb-2 text-gray-800">
          Years of Experience
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience || ''}
          onChange={(e) => handleChange({ experience: e.target.value })}
          className="border rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
          min="0"
          placeholder="0"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-2 right-6 gap-12 flex justify-between mt-8">
        <button
          onClick={handlePrev}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;