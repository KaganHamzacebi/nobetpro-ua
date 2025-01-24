import prisma from '@/libs/db/prisma';
import { BadRequest, Created } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { DutyAssistantSchema } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

// Add Assistant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const slug = (await params).dutyId;
  const { success: idSuccess, data: dutyId, error: idError } = UuidSchema.safeParse(slug);
  if (!idSuccess) return BadRequest(idError);

  const body = await request.json();
  const { success, data, error } = DutyAssistantSchema.safeParse(body);
  if (!success) return BadRequest(error);

  const response = await prisma.dutyAssistant.create({
    data: {
      ...data,
      dutyId: dutyId
    }
  });

  return Created(response);
}
