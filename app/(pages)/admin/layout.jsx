'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSideBar from '../../components/AdminSideBar/AdminSideBar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lining-nums flex w-full h-screen bg-gray-50">
      {/* Fixed width sidebar */}
      <div className="w-64 flex-shrink-0">
        <AdminSideBar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
