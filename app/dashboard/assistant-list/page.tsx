import DefaultAssistantGrid from '@/components/ui/default-assistant-grid/default-assistant-grid';
import DefaultAssistantGridLoader from '@/components/ui/default-assistant-grid/default-assistant-grid-loader';
import { getDefaultAssistants } from '@/libs/db/actions/default-assistant-actions';
import { NotificationType } from '@/libs/enums/NotificationType';
import { getUser } from '@/libs/supabase/server';
import { Divider, Text } from '@mantine/core';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function AssistantList() {
  const user = await getUser();
  if (!user) {
    redirect(`/${NotificationType.Unauthorized}=true`);
  }

  const assistantList = await getDefaultAssistants(user.id);

  return (
    <>
      <header>
        <Text fw={700} size="xl">
          Assistants
        </Text>
        <Text fw={600} size="sm" c="dimmed">
          Set the default assistant data to have on every new duty
        </Text>
        <Divider mt={4} />
      </header>
      <main className="py-4">
        <Suspense fallback={<DefaultAssistantGridLoader />}>
          <DefaultAssistantGrid assistantList={assistantList} />
        </Suspense>
      </main>
    </>
  );
}
