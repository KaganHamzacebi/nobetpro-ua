'use server';

import prisma from '../prisma';

export const getDefaultSections = async (userId: string) => {
  return await prisma.defaultSection.findMany({
    where: { userId: userId }
  });
};
