import { Button, Title } from '@mantine/core';
import Link from 'next/link';

export default function Logo() {
  return (
    <Button
      component={Link}
      href="/"
      variant="default"
      radius="md"
      className="h-fit w-fit bg-onyx px-1 shadow-lg">
      <Title order={1} className="text-snow">
        NöbetPro
      </Title>
    </Button>
  );
}
