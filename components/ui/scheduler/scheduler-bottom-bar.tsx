import { ScreenMode } from '@/libs/enums/screen-mode';
import { Button, Group } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { useContext } from 'react';
import AddButton from '../add-button';
import { SchedulerContext } from './scheduler-base';

interface ISchedulerBottomBar {
  addAssistant: () => void;
  addSection: () => void;
  handleClearSelections: () => void;
}

export default function SchedulerBottomBar({
  addAssistant,
  addSection,
  handleClearSelections
}: Readonly<ISchedulerBottomBar>) {
  const { screenMode } = useContext(SchedulerContext);

  return (
    <Group>
      <AddButton label="Add Assistant" onClick={addAssistant} />
      {screenMode === ScreenMode.SectionEditor && (
        <AddButton label="Add New Section" onClick={addSection} />
      )}
      {screenMode === ScreenMode.MonthPicker && (
        <Button
          leftSection={<IconTrashFilled />}
          onClick={handleClearSelections}
          className="bg-attention hover:bg-attention-hover">
          Clear Selections
        </Button>
      )}
    </Group>
  );
}
