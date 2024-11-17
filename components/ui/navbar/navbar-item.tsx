'use client';

import classes from '@/styles/NavbarItem.module.scss';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

interface INavbarItem {
  icon: ReactNode;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link: string;
}

export function NavbarItem({ icon, label, initiallyOpened, links, link }: Readonly<INavbarItem>) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map(link => (
    <Text
      component={Link}
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={event => event.preventDefault()}>
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        component={Link}
        href={link}
        onClick={() => setOpened(o => !o)}
        className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              {icon}
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none'
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
