import { NotificationType } from '@/libs/enums/NotificationType';
import { getUser, signOut } from '@/libs/supabase/client';
import { Avatar, Group, Menu, Text } from '@mantine/core';
import { User } from '@supabase/supabase-js';
import { IconLayoutDashboardFilled, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const iconSize = 16;

export default function UserAvatar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleSignout = () => {
    signOut();
    router.push(`/?${NotificationType.SignoutSuccess}=true`);
    setUser(null);
  };

  const menuItems = useMemo(
    () => (
      <>
        <Menu.Item
          component={Link}
          leftSection={<IconLayoutDashboardFilled size={iconSize} />}
          href="/dashboard">
          Dashboard
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={handleSignout} leftSection={<IconLogout size={iconSize} />}>
          Logout
        </Menu.Item>
      </>
    ),
    []
  );

  if (!user) return;

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Group className="bg-red">
          <Text>{user.user_metadata.full_name}</Text>
          <Avatar src={user.user_metadata.avatar_url} radius="xl" className="cursor-pointer" />
        </Group>
      </Menu.Target>

      <Menu.Dropdown>{menuItems}</Menu.Dropdown>
    </Menu>
  );
}