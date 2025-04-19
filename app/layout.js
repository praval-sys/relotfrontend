"use client"; // Make this a Client Component

import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import store from "./redux/store";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/register', '/signup'];
  const showLayout = !noLayoutRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <Provider store={store}> {/* Wrap your content with Provider */}
          {showLayout && <Navbar />}
          <main> {children}</main>
          {showLayout && <Footer />}
        </Provider>
      </body>
    </html>
  );
}