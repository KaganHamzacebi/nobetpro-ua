'use client';

import { ScreenMode } from '@/libs/enums/screen-mode';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Button, Group } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { memo } from 'react';
import AddButton from '../add-button';

function SchedulerBottomBar() {
  const addAssistant = useDutyStore.use.addAssistant();
  const addSection = useDutyStore.use.addSection();
  const screenMode = useDutyStore.use.screenMode();
  const clearAssistantSelections = useDutyStore.use.clearAllSelections();

  return (
    <Group gap="sm">
      <AddButton label="Add Assistant" onClick={addAssistant} />
      {screenMode === ScreenMode.SectionEditor && (
        <AddButton label="Add New Section" onClick={addSection} />
      )}
      {screenMode === ScreenMode.MonthPicker && (
        <Button
          leftSection={<IconTrashFilled size={20} />}
          onClick={clearAssistantSelections}
          color="red">
          Clear Selections
        </Button>
      )}
    </Group>
  );
}

export default memo(SchedulerBottomBar);
