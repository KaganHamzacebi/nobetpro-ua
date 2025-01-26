// Select Date
import prisma from '@/libs/db/prisma';
import { BadRequest, ServerError, Success } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { SelectedDayCreateSchema } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

// Select Day
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const slug = (await params).dutyId;
  const { success: idSuccess, data: dutyId, error: idError } = UuidSchema.safeParse(slug);
  if (!idSuccess) return BadRequest(idError);

  const body = await request.json();
  const { success, data, error } = SelectedDayCreateSchema.safeParse(body);
  if (!success) return BadRequest(error);

  try {
    const response = await prisma.selectedDay.create({
      data: {
        ...data,
        dutyId: dutyId
      }
    });

    return Success(response);
  } catch (e) {
    return ServerError(e);
  }
}
