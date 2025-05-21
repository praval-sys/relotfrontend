'use client';

import './globals.css';
import Navbar from '../app/components/Navbar/Navbar';
import Footer from './components/footer/Footer';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AnnouncementBar from './components/Home/AnnouncementBar';

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const noLayoutRoutes = ['/login', '/register', '/signup', '/admin'];
  const showLayout = !noLayoutRoutes.includes(pathname) && !isAdminRoute;

  return (
    <>
      {showLayout && (
        <>
          <AnnouncementBar />
          <Navbar />
        </>
      )}
      <main className={`${showLayout ? 'mt-[140px]' : ''}`}>
        {children}
      </main>
      <Toaster position="bottom-right" />
      {showLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
            <LayoutContent>{children}</LayoutContent> 
            </AuthProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
