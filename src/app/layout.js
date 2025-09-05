import { Suspense } from 'react';
import './globals.css';

export const metadata = {
  title: 'Vendor Dashboard',
  description: 'Business management dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
