'use client';

import NotificationCenter from '@/components/ui/notification-center';
import { theme } from '@/theme';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { User } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, ReactNode, Suspense, useContext } from 'react';

const UserContext = createContext<User | null>(null);

export const useUser = () => {
  return useContext(UserContext);
};

interface IProviders {
  user: User | null;
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 // 1 hour
    }
  }
});

export default function Providers({ children, user }: Readonly<IProviders>) {
  return (
    <UserContext.Provider value={user}>
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
    </UserContext.Provider>
  );
}
