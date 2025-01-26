'use client';

import { logout } from '@/libs/auth/login-actions';
import classes from '@/styles/UserButton.module.scss';
import { Avatar, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight, IconLogout, IconSettings } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

export function UserButton() {
  const { data: session } = useSession();

  const userButton = (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src={session?.user?.image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {session?.user?.name}
          </Text>

          <Text c="dimmed" size="xs">
            {session?.user?.email}
          </Text>
        </div>

        <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );

  const dropdown = (
    <>
      <Menu.Item
        disabled
        leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        color="red"
        onClick={logout}
        leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
        Sign Out
      </Menu.Item>
    </>
  );

  return (
    <Menu trigger="hover" position="right-end" openDelay={100} closeDelay={200}>
      <Menu.Target>{userButton}</Menu.Target>
      <Menu.Dropdown>{dropdown}</Menu.Dropdown>
    </Menu>
  );
}
