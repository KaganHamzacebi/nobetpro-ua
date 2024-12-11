import { IDutyAssistant, ISectionConfig } from '@/libs/models/IAssistant';
import { NumberInput } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { DutySection } from '@prisma/client';
import { useMemo, useState } from 'react';
import { useSchedulerContext } from '../scheduler/scheduler-base';

interface ISectionCellRenderer {
  assistant: IDutyAssistant;
  section: DutySection;
  sectionConfig: ISectionConfig;
}

export default function SectionCellRenderer({
  assistant,
  section,
  sectionConfig
}: Readonly<ISectionCellRenderer>) {
  const { setSectionConfigList } = useSchedulerContext();
  const [count, setCount] = useState<number>(sectionConfig?.counts[section.id] ?? 0);

  const updateSectionConfig = useDebouncedCallback((count: number) => {
    setSectionConfigList(prevList =>
      prevList.map(item =>
        item.assistantId === sectionConfig.assistantId
          ? { ...item, counts: { ...item.counts, [section.id]: count } }
          : item
      )
    );
  }, 500);

  useDidUpdate(() => {
    updateSectionConfig(count);
  }, [count]);

  const minimumSelectableDutyCount = useMemo(() => {
    return Object.values(assistant.selectedDays.days).filter(sec => sec.id === section.id).length;
  }, [assistant.selectedDays.days, section.id]);

  return (
    <div className="w-full min-w-[200px]">
      <NumberInput
        value={count}
        onChange={e => setCount(Number(e))}
        size="xs"
        min={minimumSelectableDutyCount}
        allowNegative={false}
      />
    </div>
  );
}
