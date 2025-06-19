// app/auth/google/callback/page.tsx or pages/auth/google/callback.tsx (depending on routing strategy)
"use client"; // if using app router
import dynamic from 'next/dynamic';

// Loading component
function GoogleCallbackLoading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-xl font-semibold text-gray-600">
          Processing Google Sign-In...
        </p>
      </div>
    </div>
  );
}

// Dynamically import with no SSR
const GoogleCallbackComponent = dynamic(() => Promise.resolve(GoogleCallbackComponentInternal), {
  ssr: false,
  loading: () => <GoogleCallbackLoading />
});

function GoogleCallbackComponentInternal() {
  const { useEffect, useState } = require('react');
  const { useRouter, useSearchParams } = require('next/navigation');
  const { useDispatch } = require('react-redux');
  const { toast } = require('react-hot-toast');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const user = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          toast.error('Google sign-in failed. Please try again.');
          router.push('/login');
          return;
        }

        if (accessToken && user) {
          try {
            const userData = typeof user === 'string' ? JSON.parse(decodeURIComponent(user)) : user;
            
            // Store in localStorage for persistence
            localStorage.setItem('token', accessToken);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(userData));

            toast.success(`Welcome back, ${userData.name || userData.email}!`);
            router.push('/');
            
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            toast.error('Authentication data error. Please try again.');
            router.push('/login');
          }
        } else {
          toast.error('Authentication failed. Missing required data.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('An unexpected error occurred during sign-in.');
        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    const timer = setTimeout(() => {
      handleGoogleCallback();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Processing Google Sign-In...
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we complete your authentication.
            </p>
          </>
        ) : (
          <>
            <div className="text-green-600 mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Sign-In Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Redirecting you now...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return <GoogleCallbackComponent />;
}
