import { GenerateUUID } from '@/libs/helpers/id-generator';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import { NumberInput } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { useMemo, useState } from 'react';

interface ISectionCellRenderer {
  assistant: IAssistant;
  section: ISection;
  setAssistantProps: (assistantId: IAssistant['id'], props: Partial<IAssistant>) => void;
}

export default function SectionCellRenderer({
  assistant,
  section,
  setAssistantProps
}: Readonly<ISectionCellRenderer>) {
  const [count, setCount] = useState<number>(assistant.sectionConfig.counts[section.id] ?? 0);

  const setAssistantSectionConfig = useDebouncedCallback((count: number) => {
    setAssistantProps(assistant.id, {
      sectionConfig: {
        ...assistant.sectionConfig,
        counts: {
          ...assistant.sectionConfig.counts,
          [section.id]: count
        },
        version: GenerateUUID()
      }
    });
  }, 500);

  useDidUpdate(() => {
    setAssistantSectionConfig(count);
  }, [count]);

  const minimumSelectableDutyCount = useMemo(() => {
    return Object.values(assistant.selectedDays.days).filter(sec => sec.id === section.id).length;
  }, [assistant.selectedDays.version]);

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
