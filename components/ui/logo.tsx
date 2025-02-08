import { Button, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function Logo() {
  return (
    <div className="flex flex-row gap-x-2">
      <Button
        component={Link}
        href="/"
        variant="default"
        radius="md"
        size="lg"
        className="bg-onyx shadow-lg transition-colors duration-300">
        <Title order={1} className="text-snow">
          NöbetPro
        </Title>
      </Button>
      <Text className="mr-4 self-end" fw={600} c="dimmed">
        in-dev
      </Text>
    </div>
  );
}
