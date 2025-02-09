'use server';

import SchedulerModal from '@/components/ui/scheduler/scheduler-modal';
import { getDutyById } from '@/libs/db/actions/duty-actions';

interface ISchedulerPage {
  params: Promise<{ id: string }>;
}

export default async function SchedulerPage({ params }: Readonly<ISchedulerPage>) {
  const duty = await getDutyById((await params).id);

  return <SchedulerModal duty={duty} />;
}
