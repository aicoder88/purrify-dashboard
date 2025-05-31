import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/reports',
  '/settings',
  '/api/dashboard',
  '/api/reports',
  '/api/settings',
];

// Define public routes that don't require authentication
const _publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  

  // Get token from cookies or Authorization header
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');

  // If accessing a protected route
  if (isProtectedRoute) {
    // TEMPORARILY DISABLED FOR DEVELOPMENT - Allow access without authentication
    return NextResponse.next();
    
    // if (!token) {
    //   // Redirect to login if no token
    //   const loginUrl = new URL('/login', request.url);
    //   loginUrl.searchParams.set('redirect', pathname);
    //   return NextResponse.redirect(loginUrl);
    // }

    // try {
    //   // Verify JWT token
    //   const secret = new TextEncoder().encode(
    //     process.env.JWT_SECRET || 'your-secret-key'
    //   );
    //
    //   await jwtVerify(token, secret);
    //
    //   // Token is valid, continue to the route
    //   return NextResponse.next();
    // } catch (error) {
    //   // Token is invalid, redirect to login
    //   const loginUrl = new URL('/login', request.url);
    //   loginUrl.searchParams.set('redirect', pathname);
    //
    //   const response = NextResponse.redirect(loginUrl);
    //   response.cookies.delete('auth-token');
    //   return response;
    // }
  }

  // If accessing login/register while authenticated
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      await jwtVerify(token, secret);
      
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Token is invalid, allow access to login/register
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // For API routes, add CORS headers
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};