import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ColorSchemeScript } from '@mantine/core';
import '@/styles/globals.scss';
import { ReactNode } from 'react';
import Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode; }>) {
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
      {children}
    </Providers>
    </body>
    </html>
  );
}
