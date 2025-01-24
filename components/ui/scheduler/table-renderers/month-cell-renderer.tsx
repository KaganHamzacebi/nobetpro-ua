import { ScreenMode } from '@/libs/enums/screen-mode';
import { IDutySection } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Center, Checkbox, Menu, MenuDropdown, MenuItem, Tooltip } from '@mantine/core';
import { FC, memo, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface IMonthCellRenderer {
  dayIndex: number;
  assistantId: string;
}

const SectionDropdown: FC<{
  sections: IDutySection[];
  onSelectSection: (section: IDutySection) => void;
}> = ({ sections, onSelectSection }) => {
  return (
    <MenuDropdown>
      {sections.map(section => (
        <MenuItem key={section.id} onClick={() => onSelectSection(section)}>
          {section.name}
        </MenuItem>
      ))}
    </MenuDropdown>
  );
};

const CheckboxComponent: FC<{
  isChecked: boolean;
  color: string;
  tooltip?: string;
  onChange: (isChecked: boolean) => void;
}> = ({ isChecked, color, tooltip, onChange }) => {
  return (
    <Menu.Target>
      <Tooltip disabled={!tooltip} label={tooltip} color={color}>
        <Checkbox
          checked={isChecked}
          color={color}
          onChange={e => onChange(e.currentTarget.checked)}
        />
      </Tooltip>
    </Menu.Target>
  );
};

function MonthCellRenderer({ dayIndex, assistantId }: Readonly<IMonthCellRenderer>) {
  const [menuOpen, setMenuOpen] = useState(false);

  const screenMode = useDutyStore.use.screenMode();
  const selectDay = useDutyStore.use.selectDay();
  const unselectDay = useDutyStore.use.unselectDay();
  const sectionList = useDutyStore.use.sectionList();

  const selectedDay = useDutyStore(
    useShallow(state =>
      state.selectedDays.find(day => day.dayIndex === dayIndex && day.assistantId === assistantId)
    )
  );

  const assistantSelectedDays = useDutyStore(
    useShallow(state => state.selectedDays.filter(day => day.assistantId === assistantId))
  );

  const selectedSectionsForDay = useDutyStore(
    useShallow(state =>
      state.selectedDays.filter(day => day.dayIndex === dayIndex).map(d => d.section)
    )
  );

  const assistantSectionConfig = useDutyStore(
    useShallow(state => state.assistantSectionConfig.filter(c => c.assistantId === assistantId))
  );

  const isDayDisabled = useDutyStore(
    useShallow(state => state.disabledDays[assistantId]?.includes(dayIndex))
  );

  const filteredSections = useMemo(() => {
    return sectionList.filter(section => {
      const isNotSelected = !selectedSectionsForDay.some(s => s?.id === section.id);
      const withinLimit = assistantSectionConfig.some(config => {
        const totalLimit = config.section?.id === section.id ? config.totalLimit : 0;
        const selectedCount = assistantSelectedDays.filter(
          d => d.section?.id === section.id
        ).length;
        return selectedCount < totalLimit;
      });
      return isNotSelected && withinLimit;
    });
  }, [assistantSectionConfig, assistantSelectedDays, sectionList, selectedSectionsForDay]);

  const isCheckboxInvisible = useMemo(() => {
    if (selectedDay) return false;
    return isDayDisabled || filteredSections.length === 0 || assistantSectionConfig.length === 0;
  }, [assistantSectionConfig, filteredSections, isDayDisabled, selectedDay]);

  const handleCheckboxChange = (isChecked: boolean) => {
    setMenuOpen(isChecked);
    if (!isChecked) {
      unselectDay(assistantId, dayIndex);
    }
  };

  const handleSectionSelect = (section: IDutySection) => {
    selectDay(assistantId, section, dayIndex);
    setMenuOpen(false);
  };

  if (screenMode !== ScreenMode.MonthPicker || isCheckboxInvisible) return;

  return (
    <Center>
      <Menu shadow="md" opened={menuOpen} onChange={setMenuOpen}>
        <CheckboxComponent
          tooltip={selectedDay?.section?.name}
          isChecked={!!selectedDay}
          color={selectedDay?.section?.color as string}
          onChange={handleCheckboxChange}
        />
        <SectionDropdown sections={filteredSections} onSelectSection={handleSectionSelect} />
      </Menu>
    </Center>
  );
}

export default memo(MonthCellRenderer);
