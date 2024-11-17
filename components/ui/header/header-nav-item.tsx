'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export interface INavLink {
  name: string;
  href: string;
}

export default function HeaderNavItem({ name, href }: Readonly<INavLink>) {
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => {
      return path === pathname;
    },
    [pathname]
  );

  return (
    <Button component={Link} href={href} variant={isActive(href) ? 'filled' : 'subtle'}>
      {name}
    </Button>
  );
}
