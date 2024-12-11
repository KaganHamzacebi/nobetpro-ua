import SchedulerModal from '@/components/ui/scheduler/scheduler-modal';
import prisma from '@/libs/db/prisma';
import { getUser } from '@/libs/supabase/server';

export default async function SchedulerPage() {
  const user = await getUser();

  const defaultAssistants = await prisma.defaultAssistant.findMany({
    where: {
      userId: user?.id
    }
  });

  const defaultSections = await prisma.defaultSection.findMany({
    where: {
      userId: user?.id
    }
  });

  return <SchedulerModal defaultAssistants={defaultAssistants} defaultSections={defaultSections} />;
}
