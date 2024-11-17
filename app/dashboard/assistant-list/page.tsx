import DefaultAssistantGrid from '@/components/ui/default-assistant-grid/default-assistant-grid';
import { Divider, Text } from '@mantine/core';

export default async function AssistantList() {
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
        <DefaultAssistantGrid />
      </main>
    </>
  );
}
