import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ServiceSelection from './steps/ServiceSelection';
import PersonalInfo from './steps/PersonalInfo';
import ExamSection from './steps/ExamSection';
import CertificateUpload from './steps/CertificateUpload';
import PreviewSubmission from './steps/PreviewSubmission';
import {toast} from 'react-toastify'

const ServiceProviderForm = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    serviceType: '',
    experience: '',
    hourlyRate: '',
    workingFrom: '',
    workingTo: '',
    examAnswers: [],
    certificate: null,
    score: 0,
  });
  const [completedSteps, setCompletedSteps] = useState({});

  const validateStep = () => {
    let isValid = true;
    const requiredFields = {
      1: [],
      2: ['serviceType', 'experience',  'workingFrom', 'workingTo'],
      3: ['examAnswers'],
      4: ['certificate']
    };

    requiredFields[step].forEach(field => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        isValid = false;
      }
    });

    setCompletedSteps(prev => ({
      ...prev,
      [step]: isValid
    }));

    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    } else {
      toast.error("Please fill out all required fields.");
    }
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleChange = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100vh', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white w-full max-w-4xl mx-auto rounded-lg shadow-lg lg:p-6 p-1 relative h-fit max-h-3/4"
      >
        <button onClick={onClose} className="bg-gray-300 absolute top-2 right-2 text-red-600 hover:text-red-300 px-4 py-2 rounded">&times;</button>
        <div className="container mx-auto">
          <div className="flex">
            <div className="w-1/4 lg:pr-4 pr-1">
              <ul className="steps space-y-4">
                {['Personal Information', 'Service Selection', 'Exam', 'Upload Certificate', 'Preview & Submit'].map((label, index) => {
                  const stepIndex = index + 1;
                  const isCompleted = completedSteps[stepIndex];
                  const isActive = step === stepIndex;
                  return (
                    <li
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-md border 
                        ${isActive ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'} 
                        ${isCompleted === false ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                          {stepIndex}.
                        </span>
                        <span className="hidden sm:block">{label}</span>
                      </span>
                      {isCompleted !== undefined && (
                        <FontAwesomeIcon
                          icon={isCompleted ? faCheckCircle : faTimesCircle}
                          className={`${isCompleted ? 'text-green-500' : 'text-red-500'}`}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="lg:w-3/4 lg:h-[500px] h-[650px] border lg:p-4  p-1 rounded-md">
              {step === 1 && <PersonalInfo formData={formData} handleChange={handleChange} handleNext={handleNext} />}
              {step === 2 && <ServiceSelection formData={formData} handleChange={handleChange} handlePrev={handlePrev} handleNext={handleNext} />}
              {step === 3 && <ExamSection formData={formData} handleChange={handleChange} handlePrev={handlePrev} handleNext={handleNext} />}
              {step === 4 && <CertificateUpload formData={formData} handleChange={handleChange} handlePrev={handlePrev} handleNext={handleNext} />}
              {step === 5 && <PreviewSubmission handlePrev={handlePrev} formData={formData} />}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceProviderForm;
