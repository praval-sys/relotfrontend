'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminSideBar from '../../components/AdminSideBar/AdminSideBar';
import { useAuth } from '../../context/AuthContext'; // adjust import path as per your project

export default function AdminLayout({ children }) {
  const isNavExpanded = useSelector((state) => state.sideNav.navOpen);
  const { user, loading } = useAuth();
  console.log('AdminLayout user:', user);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/login'); // or '/' or any fallback route
      }
    }
  }, [user, loading, router]);

  // While checking user or if unauthenticated, avoid rendering admin UI
  if (loading || !user || user.role !== 'ADMIN') {
    return <div className="p-4">Loading or Unauthorized...</div>;
  }

  return (
    <div className="flex w-full">
      <div
        className={`transition-all duration-300 ${
          isNavExpanded ? 'w-32' : 'w-4'
        }`}
      >
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}
