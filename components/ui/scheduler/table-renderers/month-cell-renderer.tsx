import { ScreenMode } from '@/libs/enums/screen-mode';
import { IDutySection } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Center, Checkbox, Menu, MenuDropdown, MenuItem } from '@mantine/core';
import { FC, memo, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface IMonthCellRenderer {
  dayIndex: number;
  assistantId: string;
}

const SectionDropdown: FC<{
  sectionList: IDutySection[];
  setSection: (section: IDutySection) => void;
}> = ({ sectionList, setSection }) => {
  return (
    <MenuDropdown>
      {sectionList.map(section => (
        <MenuItem key={section.id} onClick={setSection.bind(this, section)}>
          {section.name}
        </MenuItem>
      ))}
    </MenuDropdown>
  );
};

const CheckboxComponent: FC<{
  selectedSection?: IDutySection;
  onCheckboxChangeHandler: (isChecked: boolean) => void;
  isDisabled: boolean;
}> = ({ selectedSection, onCheckboxChangeHandler, isDisabled }) => {
  if (isDisabled) return;

  return (
    <Menu.Target>
      <Checkbox
        checked={!!selectedSection}
        onChange={e => onCheckboxChangeHandler(e.currentTarget.checked)}
        color={selectedSection?.color ?? 'green'}
      />
    </Menu.Target>
  );
};

function MonthCellRenderer({ dayIndex, assistantId }: Readonly<IMonthCellRenderer>) {
  const [opened, setOpened] = useState(false);
  const screenMode = useDutyStore.use.screenMode();

  const selectedDay = useDutyStore(
    useShallow(state =>
      state.selectedDays.find(day => day.dayIndex === dayIndex && day.assistantId === assistantId)
    )
  );

  const selectDay = useDutyStore.use.selectDay();
  const unselectDay = useDutyStore.use.unselectDay();
  const sectionList = useDutyStore.use.sectionList();
  const isDisabledDay = useDutyStore(
    useShallow(state => state.disabledDays[assistantId]?.includes(dayIndex))
  );

  console.log(isDisabledDay);

  const assistantSectionConfig = useDutyStore(
    useShallow(state =>
      state.assistantSectionConfig.filter(config => config.assistantId === assistantId)
    )
  );

  const isDisabled = useMemo(() => {
    return isDisabledDay || assistantSectionConfig.length === 0;
  }, [assistantSectionConfig.length, isDisabledDay]);

  const handleSelect = (section: IDutySection) => {
    if (section) {
      selectDay(assistantId, section, dayIndex);
      setOpened(false);
    }
  };

  const onCheckboxChangeHandler = (isChecked: boolean) => {
    setOpened(isChecked);
    if (!isChecked) {
      unselectDay(assistantId, dayIndex);
    }
  };

  if (screenMode !== ScreenMode.MonthPicker) return;

  return (
    <Center>
      <Menu shadow="md" opened={opened} onChange={setOpened}>
        <CheckboxComponent
          onCheckboxChangeHandler={onCheckboxChangeHandler}
          isDisabled={isDisabled}
          selectedSection={selectedDay?.section}
        />
        <SectionDropdown sectionList={sectionList} setSection={handleSelect} />
      </Menu>
    </Center>
  );
}

export default memo(MonthCellRenderer);
