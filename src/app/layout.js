import { Suspense } from 'react';
import './globals.css';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import { TanstackProvider } from '@/utils/tanstack/provider';

export const metadata = {
  title: 'Vendor Dashboard',
  description: 'Business management dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
      <AuthKitProvider>
        <TanstackProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </TanstackProvider>
      </AuthKitProvider>
      </body>
    </html>
  );
}
