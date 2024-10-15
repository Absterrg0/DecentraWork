// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// // Define the protected routes here
// const protectedRoutes = ['/dashboard', '/profile', '/projects', '/account'];

// export async function middleware(request: NextRequest) {
//   // Use NextAuth's getToken function to check if the user has a valid session token
//   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

//   // If the user is accessing a protected route
//   if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
//     // If no token is found, redirect to the signin page
//     if (!token) {
//       const signInUrl = new URL('/signin', request.url); // Redirect to signin
//       return NextResponse.redirect(signInUrl);
//     }
//   }

//   // Continue to the requested page if authenticated
//   return NextResponse.next();
// }

// // Define where the middleware should apply
// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*', '/projects/:path*', '/account/:path*'],
// };
