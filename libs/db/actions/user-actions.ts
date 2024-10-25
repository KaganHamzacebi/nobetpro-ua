'use server';

import { type Prisma } from '@prisma/client';
import prisma from '../prisma';

export const createUser = async (user: Prisma.UserCreateInput) => {
  return await prisma.user.upsert({
    where: { email: user.email },
    create: user,
    update: user
  });
};
