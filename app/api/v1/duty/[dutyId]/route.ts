import { dutyProtectedFields } from '@/libs/consts/protected-fields';
import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { clearUndefinedFieldsInPlace, removeFields } from '@/libs/helpers/protected-field.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { DutySchema, IDuty } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

// Get Duty by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);

  const response = await prisma.duty.findUnique({
    where: {
      user: {
        id: userId
      },
      id: dutyId
    },
    include: {
      assistantSectionConfig: {
        include: {
          section: true
        }
      },
      assistantList: true,
      sectionList: true,
      selectedDays: {
        include: {
          section: true
        }
      },
      unwantedDays: true
    }
  });

  if (response == null) {
    return Response.json({
      status: 404,
      message: `Duty with ID: ${dutyId} not found`
    });
  }

  return Response.json(response);
}

// Update Duty partially
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data } = getDataOrThrow(await request.json(), DutySchema.partial());

  removeFields(data, dutyProtectedFields);
  clearUndefinedFieldsInPlace(data);
  const protectedData = data as Omit<IDuty, (typeof dutyProtectedFields)[number]>;

  const response = await prisma.duty.update({
    where: {
      user: {
        id: userId
      },
      id: dutyId
    },
    data: protectedData
  });

  return Response.json(response);
}

// Delete Duty
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);

  const response = await prisma.duty.delete({
    where: {
      user: {
        id: userId
      },
      id: dutyId
    }
  });

  return Response.json(response);
}
