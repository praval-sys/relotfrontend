'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar'; // adjust paths as needed
import Footer from './components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = ['/login', '/register'].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
