import { ScreenMode } from '@/libs/enums/screen-mode';
import { Button, Group } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import AddButton from '../add-button';
import { useSchedulerContext } from './scheduler-base';

interface ISchedulerBottomBar {
  addAssistant: () => void;
  addSection: () => void;
  handleClearSelections: () => void;
  isCreateMode: boolean;
}

export default function SchedulerBottomBar({
  addAssistant,
  addSection,
  handleClearSelections,
  isCreateMode
}: Readonly<ISchedulerBottomBar>) {
  const { screenMode } = useSchedulerContext();

  return (
    <div className="flex w-full justify-between">
      <Group gap="sm">
        <AddButton label="Add Assistant" onClick={addAssistant} />
        {screenMode === ScreenMode.SectionEditor && (
          <AddButton label="Add New Section" onClick={addSection} />
        )}
        {screenMode === ScreenMode.MonthPicker && (
          <Button
            leftSection={<IconTrashFilled size={20} />}
            onClick={handleClearSelections}
            color="red">
            Clear Selections
          </Button>
        )}
      </Group>
      <Group gap="sm">
        <Button justify="end">{isCreateMode ? 'Create' : 'Update'}</Button>
      </Group>
    </div>
  );
}
