'use server';

import SchedulerModal from '@/components/ui/scheduler/scheduler-modal';
import { getDutyById } from '@/libs/db/actions/duty-actions';

interface ISchedulerPage {
  params: Promise<{ id: string }>;
}

export default async function SchedulerPage({ params }: Readonly<ISchedulerPage>) {
  const dutyId = (await params).id;
  const duty = await getDutyById(dutyId);

  return <SchedulerModal duty={duty} />;
}
