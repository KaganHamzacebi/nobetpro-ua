import TrashButton from '@/components/ui/trash-button';
import { sectionHeaderDateCountColor } from '@/libs/helpers/mantine-table-css-getters';
import { IDutySection } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Group, TextInput } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import DSColorPicker from '../../color-picker';

interface ISectionHeaderRenderer {
  section: IDutySection;
}

function SectionHeaderRenderer({ section }: Readonly<ISectionHeaderRenderer>) {
  const updateSection = useDutyStore.use.updateSection();
  const removeSection = useDutyStore.use.removeSection();
  const monthConfig = useDutyStore.use.monthConfig();
  const assistantSectionConfig = useDutyStore.use.assistantSectionConfig();

  const [fields, setFields] = useState({
    color: section.color,
    name: section.name
  });

  const setDebouncedFields = useDebouncedCallback((props: Partial<IDutySection>) => {
    updateSection(section.id, props);
  }, 500);

  const filteredSectionConfig = useMemo(
    () => assistantSectionConfig.filter(config => config.sectionId === section.id),
    [assistantSectionConfig, section.id]
  );

  const totalDayCount = useMemo(
    () =>
      filteredSectionConfig.reduce((acc, config) => {
        return acc + config.totalLimit;
      }, 0),
    [filteredSectionConfig]
  );

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
    <Group className="w-full min-w-[200px]" gap={8} wrap="nowrap">
      <TextInput size="xs" value={fields.name} onChange={handleNameChange} />
      <DSColorPicker onClose={handleColorChange} color={fields.color as string | undefined} />
      <TrashButton callback={handleRemoveSection} />
      <div
        className={`flex flex-row gap-x-1 rounded px-2 py-1 ${sectionHeaderDateCountColor(totalDayCount, monthConfig.datesInMonth)}`}>
        <span>{totalDayCount}</span>/<span>{monthConfig.datesInMonth}</span>
      </div>
    </Group>
  );
}

export default memo(SectionHeaderRenderer);
