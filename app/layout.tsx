import Providers from '@/app/providers';
import Shell from '@/components/ui/shell';
import { getUser } from '@/libs/supabase/server';
import '@/styles/globals.scss';
import { ColorSchemeScript } from '@mantine/core';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Metrics from './metrics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NobetPro',
  description: 'Duty scheduling app'
};

interface IRootLayout {
  children: ReactNode;
}

export default async function RootLayout({ children }: Readonly<IRootLayout>) {
  const user = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async></script>
        <title>Nöbet Pro</title>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <Metrics />
        <Providers user={user}>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
