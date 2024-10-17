import { useState } from 'react';
import ForgotPassword from './ForgetPassword'; 
import OtpPage from './OtpPage'; 
import ResetPassword from './resetPassword'; 

const ResetPasswordFlow = () => {
  const [step, setStep] = useState(1); // Controls which component to show
  const [email, setEmail] = useState(''); // Stores the email entered by user

  // Move to Verify OTP step
  const handleOtpSent = (enteredEmail) => {
    setEmail(enteredEmail); // Save the email
    setStep(2); // Move to OTP verification step
  };

  // Move to Reset Password step after OTP verification
  const handleOtpVerified = () => {
    setStep(3); // Move to reset password step
  };

  return (
    <div className='mt-8'>
      {step === 1 && <ForgotPassword onOtpSent={handleOtpSent} />}
      {step === 2 && <OtpPage email={email} onOtpVerified={handleOtpVerified} />}
      {step === 3 && <ResetPassword email={email} />}
    </div>
  );
};

export default ResetPasswordFlow;
