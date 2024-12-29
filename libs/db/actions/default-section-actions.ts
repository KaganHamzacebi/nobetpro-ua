'use server';

import { getUser } from '@/libs/supabase/server';
import { DefaultSection } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import prisma from '../prisma';

const getDefaultSections = async (): Promise<DefaultSection[]> => {
  const user = await getUser();
  if (!user) unauthorized();

  return await prisma.defaultSection.findMany({
    where: { userId: user.id }
  });
};

export { getDefaultSections };
