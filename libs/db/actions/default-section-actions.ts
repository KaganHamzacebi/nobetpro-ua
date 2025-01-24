'use server';

import { auth } from '@/libs/auth/auth';
import { DefaultSection } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import prisma from '../prisma';

const getDefaultSections = async (): Promise<DefaultSection[]> => {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id;

  return await prisma.defaultSection.findMany({
    where: { userId: userId }
  });
};

export { getDefaultSections };
