import prisma from '@/libs/db/prisma';
import { getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { Success } from '@/libs/helpers/response.helper';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const dutyId = (await params).dutyId;

  const res = await Promise.all([
    await prisma.selectedDay.deleteMany({
      where: {
        duty: {
          id: dutyId,
          userId
        }
      }
    }),
    await prisma.unwantedDay.deleteMany({
      where: {
        duty: {
          id: dutyId,
          userId: userId
        }
      }
    })
  ]);

  return Success(res);
}
