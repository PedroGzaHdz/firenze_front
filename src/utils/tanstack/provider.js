'use client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

const queryClient = new QueryClient();

export function TanstackProvider({ children }) {
  return (
    <AuthKitProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthKitProvider>
  );
}
