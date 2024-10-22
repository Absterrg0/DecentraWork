import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/dashboard', '/profile', '/projects', '/account'];

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered'); // Add this to see if the middleware runs
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'next-auth.session-token',
  });

  console.log('Token:', token); // Log token to check if it's available

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      console.log('User not authenticated, redirecting to sign in'); // Check if the user is redirected
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  console.log('User is authenticated'); // See if the authenticated logic works
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/projects/:path*', '/user/:path*'],
};
