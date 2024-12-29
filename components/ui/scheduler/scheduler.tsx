import SchedulerBottomBar from '@/components/ui/scheduler/scheduler-bottom-bar';
import SchedulerTable from '@/components/ui/scheduler/scheduler-table';
import SchedulerTopBar from '@/components/ui/scheduler/scheduler-top-bar';
import { Stack } from '@mantine/core';
import { memo } from 'react';

function Scheduler() {
  return (
    <Stack className="h-full w-full" gap="md">
      <SchedulerTopBar />
      <SchedulerTable />
      <SchedulerBottomBar />
    </Stack>
  );
}

export default memo(Scheduler);
