import { dutyAssistantProtectedFields } from '@/libs/consts/protected-fields';
import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { removeProtectedFields } from '@/libs/helpers/protected-field.helper';
import { Created, Success } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { DutyAssistantSchema } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

// Partially Update Assistant
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ assistantId: string; dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data: assistantId } = getDataOrThrow((await params).assistantId, UuidSchema);
  const { data } = getDataOrThrow(await request.json(), DutyAssistantSchema.partial());

  removeProtectedFields(data, dutyAssistantProtectedFields);

  const response = await prisma.dutyAssistant.update({
    where: {
      id: assistantId,
      duty: {
        id: dutyId,
        userId: userId
      }
    },
    data: data
  });

  return Success(response);
}

// Delete Assistant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ assistantId: string; dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data: assistantId } = getDataOrThrow((await params).assistantId, UuidSchema);

  const response = await prisma.dutyAssistant.delete({
    where: {
      id: assistantId,
      duty: {
        id: dutyId,
        userId: userId
      }
    }
  });

  return Created(response);
}
