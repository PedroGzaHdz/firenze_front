'use client';
import { GlobalProvider } from '@/context/globalContext';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import Sidebar from '@/components/navBar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
      <AuthKitProvider>
        <GlobalProvider>
          <Sidebar>{children}</Sidebar>
        </GlobalProvider>
      </AuthKitProvider>
      </body>
    </html>
  );
}
