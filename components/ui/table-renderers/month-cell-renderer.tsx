import { useSchedulerContext } from '@/components/ui/scheduler/scheduler-base';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { getDisabledDays } from '@/libs/helpers/disabled-day-calculator';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { newSelectedDayConfig } from '@/libs/helpers/model-generator';
import { IDutyAssistant } from '@/libs/models/IAssistant';
import { Checkbox, Menu, MenuDropdown, MenuItem, Tooltip } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { DutySection } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';

interface IMonthCellRenderer {
  dayIndex: number;
  assistant: IDutyAssistant;
}

export default function MonthCellRenderer({ dayIndex, assistant }: Readonly<IMonthCellRenderer>) {
  const {
    screenMode,
    monthConfig,
    sectionList,
    setAssistantList,
    selectedDayConfig,
    setSelectedDayConfig,
    sectionConfigList
  } = useSchedulerContext();
  const [opened, setOpened] = useState(false);

  const getSelectedSection = () => {
    return sectionList.find(s => s.id === assistant.selectedDays.days[dayIndex]?.id);
  };

  const [selectedSection, setSelectedSection] = useState<DutySection | undefined>(
    getSelectedSection()
  );

  const sectionConfig = useMemo(() => {
    return sectionConfigList.find(i => i.assistantId === assistant.id);
  }, [assistant.id, sectionConfigList]);

  const maxPossibleDutyCount = useMemo(() => {
    return Object.values(sectionConfig?.counts ?? {}).reduce((prev, curr) => prev + curr, 0);
  }, [sectionConfig?.counts]);

  const filteredSectionList = useMemo(() => {
    return sectionList.filter(s => {
      const isColumnSelectedByAnotherAssistant = selectedDayConfig[dayIndex]?.sectionIds.has(s.id);
      const sectionDutyCount = sectionConfig?.counts[s.id] ?? 0;
      const assistantCountForSection = Object.values(assistant.selectedDays.days).filter(
        section => section.id === s.id
      ).length;
      const isSectionReachedMax = assistantCountForSection === sectionDutyCount;
      return !isColumnSelectedByAnotherAssistant && !isSectionReachedMax;
    });
  }, [
    assistant.selectedDays.days,
    dayIndex,
    sectionConfig?.counts,
    sectionList,
    selectedDayConfig
  ]);

  const isDisabled = useMemo(() => {
    const isDisabledDay = assistant.disabledDays.days.includes(dayIndex);
    const isAllSectionsAreFull = filteredSectionList.length === 0;
    const isReachedMax = maxPossibleDutyCount === Object.keys(assistant.selectedDays.days).length;
    return (isDisabledDay || isAllSectionsAreFull || isReachedMax) && selectedSection == undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    assistant.disabledDays.version,
    assistant.selectedDays.version,
    dayIndex,
    filteredSectionList.length,
    maxPossibleDutyCount,
    selectedSection
  ]);

  useDidUpdate(() => {
    const updatedAssistant = { ...assistant };
    if (selectedSection) updatedAssistant.selectedDays.days[dayIndex] = selectedSection;
    else delete updatedAssistant.selectedDays.days[dayIndex];
    updatedAssistant.selectedDays.version = GenerateUUID();
    const selectedDayIndexes = Object.keys(updatedAssistant.selectedDays.days).map(i => Number(i));
    updatedAssistant.disabledDays.days = getDisabledDays(
      selectedDayIndexes,
      monthConfig.numberOfRestDays
    );
    updatedAssistant.disabledDays.version = GenerateUUID();
    setAssistantList(prevState =>
      prevState.map(oldAssistant =>
        oldAssistant.id === assistant.id ? updatedAssistant : oldAssistant
      )
    );
  }, [selectedSection?.id, monthConfig.numberOfRestDays]);

  useDidUpdate(() => {
    if (assistant.selectedDays.days[dayIndex] == undefined) {
      setSelectedSection(undefined);
    }
  }, [assistant.selectedDays.version]);

  const selectSection = useCallback(
    (section: DutySection | undefined) => {
      const dayConfig = { ...selectedDayConfig };
      if (section) {
        if (dayConfig[dayIndex]) dayConfig[dayIndex].sectionIds.add(section.id);
        else dayConfig[dayIndex] ??= newSelectedDayConfig(section.id);
      } else dayConfig[dayIndex].sectionIds.delete(selectedSection?.id ?? '');

      dayConfig[dayIndex].version = GenerateUUID();
      setSelectedSection(section);
      setSelectedDayConfig(dayConfig);
    },
    [dayIndex, selectedDayConfig, selectedSection?.id, setSelectedDayConfig]
  );

  const onCheckboxChangeHandler = useCallback(
    (isChecked: boolean) => {
      setOpened(isChecked);
      if (!isChecked) selectSection(undefined);
    },
    [selectSection]
  );

  const menuTarget = (
    <Menu.Target>
      <Tooltip
        disabled={!selectedSection}
        label={selectedSection?.name}
        transitionProps={{ transition: 'pop-bottom-right', duration: 300 }}>
        <Checkbox
          checked={!!selectedSection}
          onChange={e => onCheckboxChangeHandler(e.currentTarget.checked)}
          color={selectedSection?.color}
        />
      </Tooltip>
    </Menu.Target>
  );

  const menuDropdown = (
    <MenuDropdown>
      {filteredSectionList.map((section: DutySection) => (
        <MenuItem key={section.id} onClick={() => selectSection(section)}>
          {section.name}
        </MenuItem>
      ))}
    </MenuDropdown>
  );

  if (screenMode === ScreenMode.UnwantedDayPicker || isDisabled) return;

  return (
    <div className={`flex flex-col items-center`}>
      <Menu shadow="md" opened={opened} onChange={setOpened}>
        {menuTarget}
        {menuDropdown}
      </Menu>
    </div>
  );
}
