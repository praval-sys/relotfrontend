// app/auth/google/callback/page.tsx or pages/auth/google/callback.tsx (depending on routing strategy)
"use client"; // if using app router

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // or 'next/router' if pages router
import { useDispatch } from 'react-redux';
 // adjust import path

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  //const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const token = searchParams.get('accessToken');

   
      router.push('/');
    
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex justify-center items-center h-screen text-xl font-semibold">
      Redirecting after Google Sign-In...
    </div>
  );
};

export default GoogleCallbackPage;
