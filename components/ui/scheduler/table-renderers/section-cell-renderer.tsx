import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Flex, NumberInput } from '@mantine/core';
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
          config => config.assistantId === assistantId && config.section?.id === sectionId
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
    <Flex align="center" px={8} h="5vh">
      <NumberInput
        w={80}
        value={totalLimit}
        onChange={e => setTotalLimit(Number(e))}
        size="xs"
        min={minimumSelectableDutyCount}
        allowNegative={false}
      />
    </Flex>
  );
}

export default memo(SectionCellRenderer);
