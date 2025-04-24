'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store'; // ✅ Now persistor is imported
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

function LayoutContent({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/register', '/signup', '/checkout'];
  const showLayout = !noLayoutRoutes.includes(pathname);

  return (
    <>
      {showLayout && <Navbar />}
      <main>{children}</main>
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
            <LayoutContent children={children} />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
