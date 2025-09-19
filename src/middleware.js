import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// In middleware auth mode, each page is protected by default.
// Exceptions are configured via the `unauthenticatedPaths` option.
export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/login'],
  },
});

// Match against pages that require authentication and auth routes
// Include callback route which is essential for auth flow
export const config = { 
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ] 
};
