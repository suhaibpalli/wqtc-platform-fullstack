import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'change-me');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      // Console log to debug in Vercel/Node.js terminal
      console.log(`[Middleware] No token found for ${pathname}. Redirecting to login.`);
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role !== 'admin') {
         console.log(`[Middleware] User is not admin. Redirecting.`);
         return NextResponse.redirect(new URL('/login', req.url));
      }
    } catch (error) {
      console.error(`[Middleware] Token verification failed:`, error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
