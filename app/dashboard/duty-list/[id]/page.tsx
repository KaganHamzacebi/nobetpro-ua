'use server';

import SchedulerModal from '@/components/ui/scheduler/scheduler-modal';
import { getDutyById } from '@/libs/db/actions/duty-actions';

export default async function SchedulerPage({ params }: { params: Promise<{ id: string }> }) {
  const dutyId = (await params).id;
  const duty = await getDutyById(dutyId);

  return <SchedulerModal duty={duty} />;
}
