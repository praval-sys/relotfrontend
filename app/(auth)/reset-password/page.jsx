"use client";
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, Key, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Loading component
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function ResetPasswordComponent() {
  const [formData, setFormData] = useState({
    token: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setFormData(prev => ({ ...prev, token }));
      // Auto-verify token if provided in URL
      verifyToken(token);
    }
  }, [searchParams]);

  const verifyToken = async (token = formData.token, otp = formData.otp) => {
    if (!token && !otp) {
      toast.error('Please enter a reset token or OTP');
      return;
    }

    try {
      setVerifying(true);
      const response = await api.post('/auth/verify-reset-token', {
        token: token || undefined,
        otp: otp || undefined
      });
      
      if (response.data.success) {
        setTokenVerified(true);
        setUserEmail(response.data.data.email);
        setFormData(prev => ({ ...prev, token: response.data.data.token }));
        toast.success('Token verified successfully');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      toast.error(error.response?.data?.message || 'Invalid or expired token/OTP');
      setTokenVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    verifyToken();
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      if (response.data.success) {
        toast.success('Password reset successfully!');
        router.push('/login?message=Password reset successful. Please login with your new password.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Token/OTP verification form
  if (!tokenVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Reset Code
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the reset link token or the 6-digit code from your email
            </p>
          </div>

          <div className="mt-8">
            {/* Method Toggle */}
            <div className="flex rounded-md shadow-sm mb-6">
              <button
                type="button"
                onClick={() => setUseOtp(false)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                  !useOtp
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Reset Link
              </button>
              <button
                type="button"
                onClick={() => setUseOtp(true)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border ${
                  useOtp
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                6-Digit Code
              </button>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              {useOtp ? (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    6-Digit Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-mono tracking-widest"
                    placeholder="000000"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                    Reset Token
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    value={formData.token}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter reset token from email or URL"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={verifying}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {verifying ? (
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                ) : (
                  <Key className="-ml-1 mr-2 h-4 w-4" />
                )}
                Verify Code
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/forgotpassword"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Need a new reset code?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password for <strong>{userEmail}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              ) : (
                <Lock className="-ml-1 mr-2 h-4 w-4" />
              )}
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordComponent />
    </Suspense>
  );
}