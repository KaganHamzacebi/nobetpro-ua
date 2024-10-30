'use client';

import { Button, Card, Text } from '@mantine/core';

interface IDutyCard {
  date: string;
}

export default function DutyCard({ date }: Readonly<IDutyCard>) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Text>{date}</Text>
      </Card.Section>

      <Button color="blue" fullWidth mt="md" radius="md">
        Edit
      </Button>
    </Card>
  );
}
