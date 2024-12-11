import { useSchedulerContext } from '@/components/ui/scheduler/scheduler-base';
import { ActionIcon, Group, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { DutySection } from '@prisma/client';
import { IconTrashFilled } from '@tabler/icons-react';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import DSColorPicker from '../color-picker';

interface ISectionHeaderRenderer {
  section: DutySection;
  setSectionProps: (sectionId: DutySection['id'], props: Partial<DutySection>) => void;
  removeSection: (sectionId: DutySection['id']) => void;
}

const getBackgroundClass = (totalDayCount: number, datesInMonth: number) => {
  if (totalDayCount < datesInMonth) return 'bg-onyx';
  if (totalDayCount === datesInMonth) return 'bg-success';
  return 'bg-attention-700';
};

export default function SectionHeaderRenderer({
  section,
  setSectionProps,
  removeSection
}: Readonly<ISectionHeaderRenderer>) {
  const { monthConfig, sectionConfigList } = useSchedulerContext();

  const [fields, setFields] = useState({
    color: section.color,
    name: section.name
  });

  const setDebouncedFields = useDebouncedCallback((props: Partial<DutySection>) => {
    setSectionProps(section.id, props);
  }, 500);

  const totalDayCount = useMemo(() => {
    return sectionConfigList.reduce((prev, curr) => {
      prev += curr.counts[section.id] ?? 0;
      return prev;
    }, 0);
  }, [section.id, sectionConfigList]);

  useDidUpdate(() => {
    setDebouncedFields({ color: fields.color });
  }, [fields.color]);

  useDidUpdate(() => {
    setDebouncedFields({ name: fields.name });
  }, [fields.name]);

  const handleColorChange = useCallback((color: string) => {
    setFields(prev => ({ ...prev, color }));
  }, []);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({ ...prev, name: event.target.value }));
  }, []);

  return (
    <Group className="w-full min-w-[200px]" gap={8} wrap="nowrap">
      <TextInput size="xs" value={fields.name} onChange={handleNameChange} />
      <DSColorPicker onChange={handleColorChange} color={fields.color} />
      <Tooltip label={`Remove ${section.name}`}>
        <ActionIcon size="sm" variant="transparent" onClick={() => removeSection(section.id)}>
          <IconTrashFilled className="text-attention hover:text-attention-hover" />
        </ActionIcon>
      </Tooltip>
      <div
        className={`flex flex-row gap-x-1 rounded px-2 py-1 ${getBackgroundClass(totalDayCount, monthConfig.datesInMonth)}`}>
        <span>{totalDayCount}</span>/<span>{monthConfig.datesInMonth}</span>
      </div>
    </Group>
  );
}
