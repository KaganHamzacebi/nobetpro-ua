import DefaultSectionGrid from '@/components/ui/default-section-grid/default-section-grid';
import { Divider, Text } from '@mantine/core';

export default async function SectionList() {
  return (
    <>
      <header>
        <Text fw={700} size="xl">
          Sections
        </Text>
        <Text fw={600} size="sm" c="dimmed">
          Configure the sections here with preset values
        </Text>
        <Divider mt={4} />
      </header>
      <main className="py-4">
        <DefaultSectionGrid />
      </main>
    </>
  );
}
