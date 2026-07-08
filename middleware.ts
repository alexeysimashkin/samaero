import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  
  // Защита админских маршрутов
  if (isAdminRoute) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    if (req.auth.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // Редирект авторизованных пользователей со страниц входа
  if (isAuthRoute && req.auth?.user) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};
