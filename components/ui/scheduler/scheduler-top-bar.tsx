import ExportModal from '@/components/ui/export-modal';
import DSMonthPickerInput from '@/components/ui/scheduler/table-renderers/month-picker-input';
import RestDayInput from '@/components/ui/scheduler/table-renderers/rest-day-input';
import ScreenModeInput from '@/components/ui/scheduler/table-renderers/screen-mode-input';
import { Group } from '@mantine/core';
import { memo } from 'react';

function SchedulerTopBar() {
  return (
    <Group>
      <DSMonthPickerInput />
      <RestDayInput />
      <div className="ml-auto mt-auto flex flex-row gap-x-4">
        <ExportModal />
        <ScreenModeInput />
      </div>
    </Group>
  );
}

export default memo(SchedulerTopBar);
