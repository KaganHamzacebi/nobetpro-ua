import { sectionHeaderDateCountColor } from '@/libs/helpers/mantine-table-css.helper';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { memo, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface ISectionHeaderCounter {
  sectionId: string;
}

function SectionHeaderCounter({ sectionId }: Readonly<ISectionHeaderCounter>) {
  const monthConfig = useDutyStore.use.monthConfig();
  const filteredAssistantSectionConfig = useDutyStore(
    useShallow(state =>
      state.assistantSectionConfig.filter(config => config.sectionId === sectionId)
    )
  );

  const totalDayCount = useMemo(() => {
    return filteredAssistantSectionConfig.reduce((acc, config) => acc + config.totalLimit, 0);
  }, [filteredAssistantSectionConfig]);

  const bgColor = sectionHeaderDateCountColor(totalDayCount, monthConfig.datesInMonth);

  return (
    <div className={`flex flex-row gap-x-1 rounded px-2 py-1 ${bgColor}`}>
      <span>{totalDayCount}</span>/<span>{monthConfig.datesInMonth}</span>
    </div>
  );
}

export default memo(SectionHeaderCounter);
