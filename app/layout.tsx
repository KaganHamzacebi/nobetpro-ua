import Providers from '@/app/providers';
import MainLayout from '@/components/ui/main-layout';
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

export default function RootLayout({ children }: Readonly<IRootLayout>) {
  return (
    <html lang="en">
      <head>
        <title>Nöbet Pro</title>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
        <Metrics />
      </body>
    </html>
  );
}
