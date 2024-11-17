import { getDefaultSections } from '@/libs/db/actions/default-section-actions';
import { NotificationType } from '@/libs/enums/NotificationType';
import { getUser } from '@/libs/supabase/server';
import { Divider, Text } from '@mantine/core';
import { redirect } from 'next/navigation';

export default async function SectionList() {
  const user = await getUser();
  if (!user) {
    redirect(`/${NotificationType.Unauthorized}=true`);
  }

  const sectionList = await getDefaultSections(user.id);

  return (
    <>
      <header>
        <Text fw={700} size="xl">
          Sections
        </Text>
        <Text fw={600} size="sm" c="dimmed">
          Configure the sections here with preset values
        </Text>
        <Divider mt={4} />
      </header>
      <main className="py-4">{sectionList.length}</main>
    </>
  );
}
