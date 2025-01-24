import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { Success } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { AssistantSectionConfigSchema } from '@/libs/models/duty-model';
import { NextRequest } from 'next/server';

// Update Limit
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data } = getDataOrThrow(
    await request.json(),
    AssistantSectionConfigSchema.pick({ assistantId: true, sectionId: true, totalLimit: true })
  );

  const response = await prisma.assistantSectionConfig.update({
    where: {
      duty: {
        id: dutyId,
        userId: userId
      },
      dutyId_assistantId_sectionId: {
        dutyId: dutyId,
        assistantId: data.assistantId,
        sectionId: data.sectionId
      }
    },
    data: {
      totalLimit: data.totalLimit
    }
  });

  return Success(response);
}
