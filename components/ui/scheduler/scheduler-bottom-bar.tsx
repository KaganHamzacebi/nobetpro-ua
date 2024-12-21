'use client';

import { ScreenMode } from '@/libs/enums/screen-mode';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Button, Group } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { memo } from 'react';
import AddButton from '../add-button';

function SchedulerBottomBar() {
  console.log('scheduler-bottom-bar rendering');
  const addAssistant = useDutyStore.use.addAssistant();
  const addSection = useDutyStore.use.addSection();
  const screenMode = useDutyStore.use.screenMode();
  const clearAssistantSelections = useDutyStore.use.clearAssistantSelections();

  const { id } = useParams();
  const isNewDuty = id === 'new';

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
            onClick={clearAssistantSelections}
            color="red">
            Clear Selections
          </Button>
        )}
      </Group>
      <Group gap="sm">
        <Button justify="end">{isNewDuty ? 'Create' : 'Update'}</Button>
      </Group>
    </div>
  );
}

export default memo(SchedulerBottomBar);
