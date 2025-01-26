import { dutySectionProtectedFields } from '@/libs/consts/protected-fields';
import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { removeFields } from '@/libs/helpers/protected-field.helper';
import { BadRequest, Created, Success } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { DutySectionSchema } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

// Partially Update Section
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { userId } = await getSessionOrThrow();

  const slug = (await params).sectionId;
  const { success: idSuccess, data: sectionId, error: idError } = UuidSchema.safeParse(slug);
  if (!idSuccess) return BadRequest(idError);

  const body = await request.json();
  const { success, data, error } = DutySectionSchema.partial().safeParse(body);
  if (!success) return BadRequest(error);

  removeFields(data, dutySectionProtectedFields);

  const response = await prisma.dutySection.update({
    where: {
      id: sectionId,
      duty: {
        userId: userId
      }
    },
    data: data
  });

  return Success(response);
}

// Delete Section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: sectionId } = getDataOrThrow((await params).sectionId, UuidSchema);
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);

  const response = await prisma.dutySection.delete({
    where: {
      id: sectionId,
      duty: {
        id: dutyId,
        userId: userId
      }
    }
  });

  return Created(response);
}
