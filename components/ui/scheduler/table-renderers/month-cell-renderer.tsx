import { ScreenMode } from '@/libs/enums/screen-mode';
import { IDutyAssistant, IDutySection } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Center, Checkbox, Menu, MenuDropdown, MenuItem } from '@mantine/core';
import { Dispatch, FC, memo, SetStateAction, useCallback, useMemo, useState } from 'react';

interface IMonthCellRenderer {
  dayIndex: number;
  assistant: IDutyAssistant;
}

const SectionDropdown: FC<{
  sectionList: IDutySection[];
  setSection: Dispatch<SetStateAction<IDutySection | undefined>>;
}> = ({ sectionList, setSection }) => (
  <MenuDropdown>
    {sectionList.map(section => (
      <MenuItem key={section.id} onClick={() => setSection(section)}>
        {section.name}
      </MenuItem>
    ))}
  </MenuDropdown>
);

const CheckboxComponent: FC<{
  selectedSection?: IDutySection;
  onCheckboxChange: (isChecked: boolean) => void;
}> = ({ selectedSection, onCheckboxChange }) => (
  <Menu.Target>
    <Checkbox
      checked={!!selectedSection}
      onChange={e => onCheckboxChange(e.currentTarget.checked)}
      color={selectedSection?.color ?? 'green'}
    />
  </Menu.Target>
);

function MonthCellRenderer({ dayIndex, assistant }: Readonly<IMonthCellRenderer>) {
  const screenMode = useDutyStore.use.screenMode();
  const sectionList = useDutyStore.use.sectionList();

  const [opened, setOpened] = useState(false);
  const [selectedSection, setSelectedSection] = useState<IDutySection | undefined>();

  const isDisabled = useMemo(() => false, []);

  const handleCheckboxChange = useCallback((isChecked: boolean) => {
    setOpened(isChecked);
    if (!isChecked) setSelectedSection(undefined);
  }, []);

  if (screenMode === ScreenMode.UnwantedDayPicker || isDisabled) return;

  return (
    <Center>
      <Menu shadow="md" opened={opened} onChange={setOpened}>
        <CheckboxComponent
          selectedSection={selectedSection}
          onCheckboxChange={handleCheckboxChange}
        />
        <SectionDropdown sectionList={sectionList} setSection={setSelectedSection} />
      </Menu>
    </Center>
  );
}

export default memo(MonthCellRenderer);
