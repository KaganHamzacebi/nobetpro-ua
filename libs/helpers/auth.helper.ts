'server only';

import { z, ZodSchema } from 'zod';

import { auth } from '@/libs/auth/auth';
import { BadRequest } from '@/libs/helpers/response.helper';
import { unauthorized } from 'next/navigation';

export const getSessionOrThrow = async () => {
  const session = await auth();
  if (!session) unauthorized();
  return { session, userId: session.user?.id as string };
};

export const getDataOrThrow = <T extends ZodSchema>(
  data: unknown,
  schema: T
): { data: z.infer<T> } => {
  const { data: parsedData, error, success } = schema.safeParse(data);
  if (!success) BadRequest(error);

  return { data: parsedData };
};
