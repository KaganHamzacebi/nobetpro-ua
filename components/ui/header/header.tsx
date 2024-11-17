'use client';

import { AppShell, Burger, Group } from '@mantine/core';
import Logo from '../logo';
import UserAvatar from '../user-avatar';
import HeaderNavItem, { INavLink } from './header-nav-item';

const navLinks: INavLink[] = [
  {
    name: 'How To',
    href: '/how-to'
  },
  {
    name: 'Contact Us',
    href: '/contact-us'
  }
];

export default function Header() {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" className="relative">
        <Group>
          <Burger hiddenFrom="sm" size="sm" />
          <Logo />
        </Group>
        <Group className="absolute left-1/2 -translate-x-1/2" visibleFrom="sm">
          {navLinks.map(navLink => (
            <HeaderNavItem key={navLink.href} name={navLink.name} href={navLink.href} />
          ))}
        </Group>
        <UserAvatar />
      </Group>
    </AppShell.Header>
  );
}
