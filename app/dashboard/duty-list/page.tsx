'use server';

import DutyCard from '@/components/ui/duty-card';
import NewDutyButton from '@/components/ui/new-duty-button';
import { getDuties } from '@/libs/db/actions/duty-actions';
import { Divider, Flex, Text } from '@mantine/core';

export default async function DutyList() {
  const duties = await getDuties();

  return (
    <>
      <header className="relative">
        <Text fw={700} size="xl">
          Duties
        </Text>
        <Text fw={600} size="sm" c="dimmed">
          You can crete new duty list or edit your previous duty lists
        </Text>
        <Divider mt={4} />
      </header>
      <main>
        <Flex py={16} gap="sm" wrap="wrap" justify="flex-start">
          {duties
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;

              const aUpdatedAt = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
              const bUpdatedAt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

              return bUpdatedAt - aUpdatedAt;
            })
            .map(duty => (
              <DutyCard key={duty.id} duty={duty} />
            ))}
        </Flex>
      </main>

      <div className="fixed bottom-4 right-4">
        <NewDutyButton />
      </div>
    </>
  );
}
