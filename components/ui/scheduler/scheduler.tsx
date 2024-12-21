import SchedulerBottomBar from '@/components/ui/scheduler/scheduler-bottom-bar';
import SchedulerTable from '@/components/ui/scheduler/scheduler-table';
import SchedulerTopBar from '@/components/ui/scheduler/scheduler-top-bar';
import { IDuty } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Stack } from '@mantine/core';
import { memo, useEffect } from 'react';

interface IScheduler {
  defaultDuty: IDuty;
}

function Scheduler({ defaultDuty }: Readonly<IScheduler>) {
  const setDuty = useDutyStore.use.setDuty();

  useEffect(() => {
    console.log('setting duty', defaultDuty);
    setDuty(defaultDuty);
  }, [defaultDuty, setDuty]);

  return (
    <Stack className="h-full w-full" gap="md">
      <SchedulerTopBar />
      <SchedulerTable />
      <SchedulerBottomBar />
    </Stack>
  );
}

export default memo(Scheduler);
