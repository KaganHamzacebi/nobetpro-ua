'use server';

import DutyCard from '@/components/ui/duty-card';
import NewDutyButton from '@/components/ui/new-duty-button';
import { getDuties } from '@/libs/db/actions/duty-actions';
import { Divider, Flex, Text } from '@mantine/core';

export default async function DutyList() {
  const duties = await getDuties();

  return (
    <>
      <header>
        <Text fw={700} size="xl">
          Duties
        </Text>
        <Text fw={600} size="sm" c="dimmed">
          You can crete new duty list or edit your previous duty lists
        </Text>
        <Divider mt={4} />
      </header>
      <main className="max-h-full py-4">
        <Flex className="max-h-full" wrap="wrap" gap="lg" align="center" justify="start">
          {duties
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;

              const aUpdatedAt = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
              const bUpdatedAt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

              // Sort by `updatedAt` (most recently updated first)
              return bUpdatedAt - aUpdatedAt;
            })
            .map(duty => (
              <DutyCard key={duty.id} duty={duty} />
            ))}
        </Flex>
      </main>
      <NewDutyButton />
    </>
  );
}
