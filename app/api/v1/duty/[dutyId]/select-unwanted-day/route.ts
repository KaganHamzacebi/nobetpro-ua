import prisma from '@/libs/db/prisma';
import { getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { BadRequest, Success } from '@/libs/helpers/response.helper';
import { UnwantedDaySchema } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  // TODO: check user authorization here, whether user modify their own data
  await getSessionOrThrow();

  const dutyId = (await params).dutyId;
  const body = await request.json();
  const { success, data, error } = UnwantedDaySchema.safeParse(body);
  if (!success) return BadRequest(error);

  const res = await prisma.unwantedDay.create({
    data: {
      dutyId: dutyId,
      assistantId: data.assistantId,
      dayIndex: data.dayIndex
    }
  });

  return Success(res);
}
