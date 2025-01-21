import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; 
  const authToken = request.cookies.get('authToken')?.value;

  if (pathname === '/ocupacional') {
    const response = NextResponse.next();
    response.cookies.delete('authToken'); 
    return response;
  }

  if (pathname === '/ambiental') {
    const response = NextResponse.next();
    response.cookies.delete('authToken'); 
    return response;
  }

  if (pathname.startsWith('/ocupacional/dashboard')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/ocupacional', request.url));
    }
  }

  if (pathname.startsWith('/ambiental/dashboard')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/ambiental', request.url));
    }
  }

  return NextResponse.next();
}

// Configuración del matcher
// export const config = {
//   matcher: ['/ocupacional', '/ocupacional/dashboard'],
// };
