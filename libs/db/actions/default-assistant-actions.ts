'use server';

import prisma from '../prisma';

export const getDefaultAssistants = async (userId: string) => {
  return await prisma.defaultAssistant.findMany({
    where: { userId: userId }
  });
};
