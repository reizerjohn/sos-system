import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { userTypeRoutes } from './constants/defaults';
import { NextResponse } from 'next/server';

// Add list of routes to matcher array to protect from unauthenticated access
// Reference: https://next-auth.js.org/tutorials/securing-pages-and-api-routes

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const userType = request.nextauth.token.user['type'];
    const pageRoute = request.nextUrl.pathname;
    const userRoutes = userTypeRoutes.find((r) => r.userType === userType);
    const hasAccess = userRoutes.routes.some((r) => pageRoute.startsWith(r));
    const isHomePage = pageRoute === '/';

    if (!hasAccess && !isHomePage) {
      return NextResponse.rewrite(new URL('/auth/error', request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/((?!api|login|images|assets|_next/static|_next/image|favicon.ico).*)'],
};
