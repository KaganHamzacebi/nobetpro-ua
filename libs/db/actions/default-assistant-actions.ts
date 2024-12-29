'use server';

import { getUser } from '@/libs/supabase/server';
import { DefaultAssistant } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import prisma from '../prisma';

const getDefaultAssistants = async (): Promise<DefaultAssistant[]> => {
  const user = await getUser();
  if (!user) unauthorized();

  return await prisma.defaultAssistant.findMany({
    where: { userId: user.id }
  });
};

export { getDefaultAssistants };
