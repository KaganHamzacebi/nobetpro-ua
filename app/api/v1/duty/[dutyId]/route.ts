import { auth } from '@/libs/auth/auth';
import { dutyProtectedFields } from '@/libs/consts/protected-fields';
import prisma from '@/libs/db/prisma';
import { removeProtectedFields } from '@/libs/helpers/protected-field.helper';
import { BadRequest } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { DutySchema } from '@/libs/models/duty-model';
import { unauthorized } from 'next/navigation';
import { NextRequest } from 'next/server';

// Get Duty by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id as string;

  const id = (await params).dutyId;
  const isValid = UuidSchema.safeParse(id);
  if (!isValid.success) {
    return Response.json({
      status: 403,
      message: isValid.error.errors.map(error => error.message).join(', ')
    });
  }

  const response = await prisma.duty.findUnique({
    where: {
      user: {
        id: userId
      },
      id: id
    },
    include: {
      assistantSectionConfig: {
        include: {
          section: true
        }
      },
      assistantList: true,
      monthConfig: true,
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
      message: `Duty with ID: ${id} not found`
    });
  }

  return Response.json(response);
}

// Update Duty partially
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id as string;

  const id = (await params).dutyId;
  const { success: idSuccess, data: dutyId, error: idError } = UuidSchema.safeParse(id);
  if (!idSuccess) return BadRequest(idError);

  const body = await request.json();
  const { success, data, error } = DutySchema.partial().safeParse(body);
  if (!success) return BadRequest(error);

  removeProtectedFields(data, dutyProtectedFields);

  const response = await prisma.duty.update({
    where: {
      user: {
        id: userId
      },
      id: dutyId
    },
    data: {
      ...data
    }
  });

  return Response.json(response);
}

// Delete Duty
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id as string;

  const id = (await params).dutyId;
  const isValid = UuidSchema.safeParse(id);
  if (!isValid.success) {
    return BadRequest(isValid.error);
  }

  const response = await prisma.duty.delete({
    where: {
      user: {
        id: userId
      },
      id: id
    }
  });

  return Response.json(response);
}
