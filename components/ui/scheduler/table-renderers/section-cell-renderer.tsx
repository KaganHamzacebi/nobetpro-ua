import { useDutyStore } from '@/libs/stores/use-duty-store';
import { NumberInput } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { memo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface ISectionCellRenderer {
  assistantId: string;
  sectionId: string;
}

function SectionCellRenderer({ assistantId, sectionId }: Readonly<ISectionCellRenderer>) {
  const assistantSectionConfig = useDutyStore(
    useShallow(
      state =>
        state.assistantSectionConfig.find(
          config => config.assistantId === assistantId && config.sectionId === sectionId
        )?.totalLimit ?? 0
    )
  );
  const setAssistantSectionLimit = useDutyStore.use.setAssistantSectionLimit();
  const [totalLimit, setTotalLimit] = useState(assistantSectionConfig);

  const updateLimit = (count: number) => {
    setAssistantSectionLimit(assistantId, sectionId, count);
  };

  const updateSectionConfig = useDebouncedCallback((count: number) => {
    updateLimit(count);
  }, 500);

  useDidUpdate(() => {
    updateSectionConfig(totalLimit);
  }, [totalLimit]);

  const minimumSelectableDutyCount = 0;

  return (
    <div className="w-full min-w-[200px]">
      <NumberInput
        value={totalLimit}
        onChange={e => setTotalLimit(Number(e))}
        size="xs"
        min={minimumSelectableDutyCount}
        allowNegative={false}
      />
    </div>
  );
}

export default memo(SectionCellRenderer);
