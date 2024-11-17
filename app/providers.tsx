'use client';

import NotificationCenter from '@/components/ui/notification-center';
import { getUser } from '@/libs/supabase/client';
import { theme } from '@/theme';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { User } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, ReactNode, Suspense, useContext, useEffect, useState } from 'react';

const UserContext = createContext<User | null>(null);

export const useUser = () => {
  return useContext(UserContext);
};

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const getAndSetUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    getAndSetUser();
  }, []);

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
