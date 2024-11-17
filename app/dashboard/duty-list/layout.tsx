import DutyCard from '@/components/ui/duty-card';
import { Divider, Flex, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { ReactNode } from 'react';

const duties = [{ date: dayjs().toISOString() }];

interface IDutyListLayout {
  children: ReactNode;
}

export default async function DutyListLayout({ children }: Readonly<IDutyListLayout>) {
  return (
    <>
      {children}
      <header>
        <Text fw={700} size="xl">
          Duties
        </Text>
        <Text fw={600} size="sm" c="dimmed">
          You can crete new duty list or edit your previous duty lists
        </Text>
        <Divider mt={4} />
      </header>
      <main className="py-4">
        <Flex wrap="wrap" gap="lg" align="center" justify="start">
          {duties.map(duty => (
            <DutyCard key={duty.date} {...duty} />
          ))}
        </Flex>
      </main>
    </>
  );
}
