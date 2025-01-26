import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { Created } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { NextRequest } from 'next/server';

// Delete Sections AssistantSectionConfigs
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string; sectionId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data: sectionId } = getDataOrThrow((await params).sectionId, UuidSchema);

  const response = await prisma.assistantSectionConfig.deleteMany({
    where: {
      duty: {
        id: dutyId,
        userId: userId
      },
      sectionId: sectionId
    }
  });

  return Created(response);
}
