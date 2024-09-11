import React, { useState } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyCodeForm from './VerifyCodeForm';
import ResetPasswordForm from './ResetPasswordForm';

const PasswordResetFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep(2);
  };

  const handleCodeVerified = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        {step === 1 && <ForgotPasswordForm onEmailSubmit={handleEmailSubmit} />}
        {step === 2 && <VerifyCodeForm email={email} onCodeVerified={handleCodeVerified} />}
        {step === 3 && <ResetPasswordForm email={email} />}
      </div>
    </div>
  );
};

export default PasswordResetFlow;