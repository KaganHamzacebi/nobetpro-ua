import { Skeleton, Stack } from '@mantine/core';

export default function DefaultAssistantGridLoader() {
  return (
    <Stack gap="xs">
      {Array.from({ length: 4 }).map(() => (
        <Skeleton key="item" width="100%" height={50} radius="lg" />
      ))}
    </Stack>
  );
}
