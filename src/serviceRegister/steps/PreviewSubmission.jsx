import React, { useState } from 'react';
import Api from '../../utils/Api.js';
import { toast } from 'react-toastify';

const PreviewSubmission = ({ formData, handlePrev }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const {
    name,
    email,
    phoneNo,
    address,
    serviceType,
    examAnswers,
    certificate,
    score,
    pass,
    workingFrom,
    workingTo,
    experience,
    rateCharge,
  } = formData;

  const totalQuestions = examAnswers.length;
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

  const handleSubmit = async () => {
    setLoading(true);
  
    if (!certificate) {
      toast.error('Please upload a certificate.');
      setLoading(false);
      return;
    }

    const data = new FormData();
  
    // Append data fields
    data.append('servicesType', serviceType);
    data.append('rateCharge', rateCharge);
    data.append('experience', experience);
    data.append('workingFrom', workingFrom);
    data.append('workingTo', workingTo);
    data.append('examResults', `${score} out of ${totalQuestions} (${percentage}%) - ${pass ? 'Pass' : 'Fail'}`);
    data.append('address', address);

    if (certificate) {
      data.append('certificate', certificate);
    }

    try {
      const response = await Api.post('service-provider/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        setSubmissionStatus({
          message: response.data.message,
          verified: false,
          serviceType,
        });
        setSubmitted(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Display the specific error message from the backend
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to submit the application. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {submitted && submissionStatus ? (
        <div className="mt-4 p-4 border rounded border-gray-300 bg-yellow-100">
          <h2 className="font-bold text-lg">Submission Status</h2>
          <p>{submissionStatus.message}</p>
          <p><strong>Service Type:</strong> {submissionStatus.serviceType}</p>
          <p><strong>Status:</strong> {submissionStatus.verified ? 'Verified' : 'Not Verified'}</p>
          <button onClick={handlePrev} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit Application
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Preview & Submit</h2>
          <div className="mb-4 lg:h-[400px] h-[550px] overflow-y-auto">
            {/* Personal Info */}
            <p className="py-3"><strong>Address:</strong> {address}</p>
            
            {/* Service and Exam Info */}
            <h3 className="font-semibold mb-2">Detail:</h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4 border">Field</th>
                  <th className="py-2 px-4 border">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border">Service Type</td>
                  <td className="py-2 px-4 border bg-yellow-500/45">{serviceType}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">Rate Charge</td>
                  <td className="py-2 px-4 border bg-yellow-500/45">(₹){rateCharge}/hr</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">Working From</td>
                  <td className="py-2 px-4 border bg-yellow-500/45">{workingFrom} to {workingTo}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">Work Experience</td>
                  <td className="py-2 px-4 border bg-yellow-500/45">{experience} Years</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border">Exam Result</td>
                  <td className="py-2 px-4 border bg-yellow-500/45">
                    <p>{score} out of {totalQuestions} ({percentage}%)</p>
                    <p>{pass ? 'Pass' : 'Fail'}</p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Certificate Upload */}
            <h3 className="font-semibold">Uploaded Certificate</h3>
            {certificate ? (
              <div>
                <p>Your certificate has been uploaded successfully.</p>
                <img src={URL.createObjectURL(certificate)} alt="Uploaded Certificate" className="mt-2 w-44 h-32 object-fill" />
              </div>
            ) : (
              <p>No certificate uploaded.</p>
            )}
          </div>

          {/* Buttons */}
          <div className="absolute bottom-2 right-6 flex gap-12 justify-between">
            <button onClick={handlePrev} className="px-6 py-2 hover:bg-gray-500 btn rounded bg-gray-400">Previous</button>
            <button 
              onClick={handleSubmit} 
              disabled={loading || submitted}
              className={`px-3 py-1 btn rounded text-white ${loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSubmission;
