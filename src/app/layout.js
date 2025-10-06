import { Suspense } from 'react';
import './globals.css';
import { HeroUIProvider } from '@heroui/system';
import { TanstackProvider } from '@/utils/tanstack/provider';

export const metadata = {
  title: 'Vendor Dashboard',
  description: 'Business management dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <HeroUIProvider>
          <TanstackProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </TanstackProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
