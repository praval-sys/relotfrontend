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
import { Raleway } from 'next/font/google';

// Configure Raleway font
const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const noLayoutRoutes = ['/login', '/register', '/signup', '/admin'];
  const showLayout = !noLayoutRoutes.includes(pathname) && !isAdminRoute;

  return (
    <>
      {showLayout && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
      <main 
        className={`relative ${
          showLayout ? 'pt-[140px] md:pt-[140px] lg:pt-[168px]' : ''
        } min-h-screen w-full overflow-x-hidden`}
      >
        {children}
      </main>
      <Toaster position="bottom-right" />
      {showLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={raleway.className}>
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
