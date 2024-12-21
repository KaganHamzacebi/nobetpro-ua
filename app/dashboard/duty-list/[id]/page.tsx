import SchedulerModal from '@/components/ui/scheduler/scheduler-modal';
import prisma from '@/libs/db/prisma';
import { NewDuty } from '@/libs/helpers/model-generator';
import { IDuty } from '@/libs/models/duty-model';
import { getUser } from '@/libs/supabase/server';
import { notFound, unauthorized } from 'next/navigation';

interface ISchedulerPage {
  params: Promise<{
    [key: string]: string;
  }>;
}

const prepareDuty = async (userId: string) => {
  const [defaultAssistants, defaultSections] = await Promise.all([
    prisma.defaultAssistant.findMany({
      where: {
        userId: userId
      }
    }),
    prisma.defaultSection.findMany({
      where: {
        userId: userId
      }
    })
  ]);

  return NewDuty(defaultAssistants, defaultSections);
};

export default async function SchedulerPage({ params }: Readonly<ISchedulerPage>) {
  const { id } = await params;
  const user = await getUser();
  if (user == null) {
    unauthorized();
  }

  if (id === 'new') {
    const newDuty = await prepareDuty(user.id);
    return <SchedulerModal duty={newDuty} />;
  } else {
    const duty = null;
    // fetch duty here
    if (duty == null) {
      notFound();
    }

    return <SchedulerModal duty={duty as IDuty} />;
  }
}
