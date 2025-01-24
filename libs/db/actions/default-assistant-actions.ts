'use server';

import { auth } from '@/libs/auth/auth';
import { DefaultAssistant } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import prisma from '../prisma';

const getDefaultAssistants = async (): Promise<DefaultAssistant[]> => {
  const session = await auth();
  if (!session?.user) unauthorized();

  return await prisma.defaultAssistant.findMany({
    where: { userId: session.user.id }
  });
};

export { getDefaultAssistants };
