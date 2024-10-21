import AssistantDNDList from '@/components/ui/assistant-dnd-list/assistant-dnd-list';
import AssistantDNDListLoader from '@/components/ui/assistant-dnd-list/assistant-dnd-list-loader';
import { getAssistants } from '@/libs/db/actions/assistant-actions';
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

  const assistantList = await getAssistants(user.id);

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
        <Suspense fallback={<AssistantDNDListLoader />}>
          <AssistantDNDList assistantList={assistantList} />
        </Suspense>
      </main>
    </>
  );
}
