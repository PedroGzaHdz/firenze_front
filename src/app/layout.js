'use client';
import { GlobalProvider } from '@/context/globalContext';
import Sidebar from '@/components/navBar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <GlobalProvider>
          <Sidebar>{children}</Sidebar>
        </GlobalProvider>
      </body>
    </html>
  );
}
