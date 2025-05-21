'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminSideBar from '../../components/AdminSideBar/AdminSideBar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const isNavExpanded = useSelector((state) => state.sideNav.navOpen);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return <div className="p-4">Loading or Unauthorized...</div>;
  }

  return (
    <div className="flex w-full h-screen">
      <div
        className={`transition-all duration-300 bg-gray-900 text-white ${
          isNavExpanded ? 'w-60' : 'w-16'
        }`}
      >
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 p-4">{children}</div>
    </div>
  );
}
