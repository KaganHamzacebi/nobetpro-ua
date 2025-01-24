// Unselect Day
import prisma from '@/libs/db/prisma';
import { BadRequest, ServerError, Success } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const slug = (await params).dutyId;
  const { success: idSuccess, data: dutyId, error: idError } = UuidSchema.safeParse(slug);
  if (!idSuccess) return BadRequest(idError);

  const body = await request.json();
  const { success, data, error } = z
    .object({
      assistantId: z.string(),
      dayIndex: z.number()
    })
    .safeParse(body);
  if (!success) return BadRequest(error);

  try {
    const response = await prisma.selectedDay.delete({
      where: {
        dutyId: dutyId,
        assistantId_dayIndex: {
          assistantId: data.assistantId,
          dayIndex: data.dayIndex
        }
      }
    });

    return Success(response);
  } catch (e) {
    return ServerError(e);
  }
}
