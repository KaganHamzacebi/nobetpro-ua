'use client';

import NotificationCenter from '@/components/ui/notification-center';
import { theme } from '@/theme';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';

interface IProviders {
  session: Session | null;
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 // 1 hour
    }
  }
});

export default function Providers({ session, children }: Readonly<IProviders>) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <ModalsProvider>
            <Notifications />
            <Suspense>
              <NotificationCenter />
            </Suspense>
            {children}
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
