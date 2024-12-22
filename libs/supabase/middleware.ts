import { type NextRequest, NextResponse } from 'next/server';
import { NotificationType } from '../enums/NotificationType';
import { createClient } from './server';

const protectedRoutes = ['/dashboard'];

const isProtectedRoute = (route: string) => {
  return protectedRoutes.some(r => route.startsWith(r));
};

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    const response = NextResponse.next({
      request: {
        headers: request.headers
      }
    });

    const supabase = await createClient();

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    const route = request.nextUrl.pathname;

    // Do not let user the go / route if logged in already
    if ((route === '/' || route === '/dashboard') && !user.error) {
      return NextResponse.redirect(new URL(`/dashboard/duty-list`, request.url));
    }
    // Unauthorized case
    else if (isProtectedRoute(route) && !user.data.user) {
      return NextResponse.redirect(new URL(`/?${NotificationType.Unauthorized}=true`, request.url));
    }

    return response;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      console.log(e);
    }
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }
};
