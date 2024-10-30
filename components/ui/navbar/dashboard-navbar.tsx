'use client';

import classes from '@/styles/DashboardNavbar.module.scss';
import { AppShell, rem, ScrollArea } from '@mantine/core';
import { IconListCheck, IconSquares, IconUser } from '@tabler/icons-react';
import { NavbarItem } from './navbar-item';
import { UserButton } from './user-button';

const navbarIconStyle = { style: { width: rem(18), height: rem(18) } };

const navbarItems = [
  { label: 'Duties', link: '/dashboard/duty-list', icon: <IconListCheck {...navbarIconStyle} /> },
  {
    label: 'Assistants',
    link: '/dashboard/assistant-list',
    icon: <IconUser {...navbarIconStyle} />
  },
  {
    label: 'Sections',
    link: '/dashboard/section-list',
    icon: <IconSquares {...navbarIconStyle} />
  }
];

export default function DashboardNavbar() {
  const links = navbarItems.map(item => <NavbarItem {...item} key={item.label} />);

  return (
    <AppShell.Navbar>
      <nav className={classes.navbar}>
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <UserButton />
        </div>
      </nav>
    </AppShell.Navbar>
  );
}
