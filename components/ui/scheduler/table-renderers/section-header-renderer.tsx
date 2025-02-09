import SectionHeaderCounter from '@/components/ui/scheduler/table-renderers/section-header-counter';
import TrashButton from '@/components/ui/trash-button';
import { IDutySection } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Group, TextInput } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import DSColorPicker from '../../color-picker';

interface ISectionHeaderRenderer {
  section: IDutySection;
}

function SectionHeaderRenderer({ section }: Readonly<ISectionHeaderRenderer>) {
  const updateSection = useDutyStore.use.updateSection();
  const removeSection = useDutyStore.use.removeSection();

  const [fields, setFields] = useState({
    color: section.color,
    name: section.name
  });

  const setDebouncedFields = useDebouncedCallback((props: Partial<IDutySection>) => {
    updateSection(section.id, props);
  }, 500);

  useDidUpdate(() => {
    setDebouncedFields({ color: fields.color });
  }, [fields.color]);

  useDidUpdate(() => {
    setDebouncedFields({ name: fields.name });
  }, [fields.name]);

  const handleRemoveSection = useCallback(() => {
    removeSection(section.id);
  }, [removeSection, section.id]);

  const handleColorChange = useCallback((color: string) => {
    setFields(prev => ({ ...prev, color }));
  }, []);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({ ...prev, name: event.target.value }));
  }, []);

  return (
    <Group gap={8} wrap="nowrap">
      <TextInput size="xs" value={fields.name} onChange={handleNameChange} />
      <DSColorPicker onClose={handleColorChange} color={fields.color as string} />
      <TrashButton callback={handleRemoveSection} tooltip={`Delete ${section.name}`} />
      <SectionHeaderCounter sectionId={section.id} />
    </Group>
  );
}

export default memo(SectionHeaderRenderer);
