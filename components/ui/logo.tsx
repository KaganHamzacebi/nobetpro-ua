import { Button, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function Logo() {
  return (
    <>
      <Button
        component={Link}
        href="/"
        variant="default"
        radius="md"
        className="bg-onyx h-fit w-fit px-1 shadow-lg">
        <Title order={1} className="text-snow">
          NöbetPro
        </Title>
      </Button>
      <Text className="mr-4 self-end" fw={600} c="dimmed">
        in-dev
      </Text>
    </>
  );
}
