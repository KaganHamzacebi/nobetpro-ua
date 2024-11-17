'use client';

import { ScreenMode } from '@/libs/enums/screen-mode';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { useAssistantList } from '@/libs/hooks/use-assistant-list';
import { useSectionList } from '@/libs/hooks/use-section-list';
import {
  DefaultAssistantList,
  DefaultMonthConfig,
  DefaultSectionList
} from '@/libs/mock/duty.data';
import {
  DefaultSchedulerContext,
  ISchedulerContext,
  SelectedDayConfig
} from '@/libs/models/DutyContext';
import { MonthConfig } from '@/libs/models/MonthConfig';
import { Stack } from '@mantine/core';
import dayjs from 'dayjs';
import { createContext, useCallback, useMemo, useState, useTransition } from 'react';
import Scheduler from './scheduler';
import SchedulerBottomBar from './scheduler-bottom-bar';
import SchedulerTopBar from './scheduler-top-bar';

export const SchedulerContext = createContext<ISchedulerContext>(DefaultSchedulerContext);

export default function SchedulerBase() {
  const [isPending, startTransition] = useTransition();
  const [monthConfig, setMonthConfig] = useState<MonthConfig>(DefaultMonthConfig);
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode.MonthPicker);
  const [selectedDayConfig, setSelectedDayConfig] = useState<SelectedDayConfig>({});
  const [unwantedDays, setUnwantedDays] = useState<Record<string, boolean>>({});

  const {
    assistantList,
    setAssistantList,
    addNewAssistant,
    removeAssistant,
    setAssistantProps,
    handleClearSelections
  } = useAssistantList(DefaultAssistantList, setSelectedDayConfig);

  const { sectionList, setSectionList, addSection, removeSection, setSectionProps } =
    useSectionList(DefaultSectionList);

  const contextValue = useMemo(
    () => ({
      screenMode,
      monthConfig,
      assistantList,
      setAssistantList,
      sectionList,
      setSectionList,
      selectedDayConfig,
      setSelectedDayConfig
    }),
    [
      screenMode,
      monthConfig,
      assistantList,
      setAssistantList,
      sectionList,
      setSectionList,
      selectedDayConfig
    ]
  );

  const handleScreenModeChange = useCallback((mode: ScreenMode) => {
    startTransition(() => {
      setScreenMode(mode);
    });
  }, []);

  const onDateChange = useCallback(
    (date: Date | null) => {
      if (!date) throw new Error('An undefined Date is set as month');

      const newDate = dayjs(date);
      const oldDate = dayjs(monthConfig.selectedDate);
      if (newDate.isSame(oldDate, 'month')) return;

      setMonthConfig(prevState => ({
        selectedDate: date,
        datesInMonth: newDate.daysInMonth(),
        weekendIndexes: getWeekendDayIndexes(date),
        numberOfRestDays: prevState.numberOfRestDays
      }));
    },
    [monthConfig.selectedDate]
  );

  const setNumberOfRestDays = useCallback((numberOfRestDays: string | number) => {
    setMonthConfig(prev => ({
      ...prev,
      numberOfRestDays: Number(numberOfRestDays)
    }));
  }, []);

  const toggleUnwantedDay = useCallback(
    (assistantId: string, index: number) => {
      if (screenMode !== ScreenMode.UnwantedDayPicker) return;
      setUnwantedDays(prev => {
        const id = assistantId + '-' + index;
        const updatedMap = { ...prev };
        if (updatedMap[id] != undefined) delete updatedMap[id];
        else updatedMap[id] = true;

        return updatedMap;
      });
    },
    [screenMode]
  );

  return (
    <SchedulerContext.Provider value={contextValue}>
      <Stack className="h-full w-full" gap="md">
        <SchedulerTopBar
          onDateChange={onDateChange}
          setNumberOfRestDays={setNumberOfRestDays}
          handleScreenModeChange={handleScreenModeChange}
        />
        <Scheduler
          isPending={isPending}
          removeAssistant={removeAssistant}
          setAssistantProps={setAssistantProps}
          unwantedDays={unwantedDays}
          toggleUnwantedDay={toggleUnwantedDay}
          setSectionProps={setSectionProps}
          removeSection={removeSection}
        />
        <SchedulerBottomBar
          addAssistant={addNewAssistant}
          addSection={addSection}
          handleClearSelections={handleClearSelections}
        />
      </Stack>
    </SchedulerContext.Provider>
  );
}
