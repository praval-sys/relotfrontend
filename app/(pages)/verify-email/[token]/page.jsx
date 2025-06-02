'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { verifyEmailWithToken } from '../../../lib/profile';

const VerifyEmailPage = () => {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;
  
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      if (!token || typeof token !== 'string') {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        setStatus('loading');
        const result = await verifyEmailWithToken(token);
        
        if (!result.success) {
          throw new Error(result.message || 'Verification failed');
        }
        
        setStatus('success');
        setMessage(result.message || 'Email verified successfully!');
        
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error?.message || 'Verification failed. Please try again.');
      }
    };

    handleVerification();
  }, [token, router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
              <p className="text-gray-600 mt-2">Please wait while we confirm your email address</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Email Verified Successfully! 🎉</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Redirecting you to your profile in 3 seconds...</p>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  Go to Profile Now
                </button>
              </div>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">The verification link may be expired or invalid.</p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                  >
                    Back to Profile
                  </button>
                  <p className="text-xs text-gray-500">
                    Go to your profile to request a new verification email
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};

export default VerifyEmailPage;