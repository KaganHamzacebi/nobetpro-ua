'use client';

import { useUser } from '@/app/providers';
import { signOut } from '@/libs/supabase/login-actions';
import classes from '@/styles/UserButton.module.scss';
import { Avatar, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight, IconLogout, IconSettings } from '@tabler/icons-react';

export function UserButton() {
  const user = useUser();

  const userButton = (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src={user?.user_metadata.avatar_url} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user?.user_metadata.full_name}
          </Text>

          <Text c="dimmed" size="xs">
            {user?.user_metadata.email}
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
        onClick={() => signOut()}
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
