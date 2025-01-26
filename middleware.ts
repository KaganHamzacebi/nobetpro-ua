import { NextResponse } from 'next/server';
import { auth } from './libs/auth/auth';

const WHITE_LIST = ['/', '/how-to', '/contact-us'];

export default auth(async req => {
  const isWhiteListed = WHITE_LIST.includes(req.nextUrl.pathname);

  // Redirect to sign-in page if not authenticated
  if (!req.auth && !isWhiteListed) {
    const url = new URL('/', req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  // Redirect to home page if authenticated
  if (req.auth && isWhiteListed) {
    const url = new URL('/dashboard/duty-list', req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
