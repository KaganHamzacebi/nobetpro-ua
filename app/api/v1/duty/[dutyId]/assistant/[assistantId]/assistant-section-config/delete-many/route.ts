import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { Created } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { NextRequest } from 'next/server';

// Delete Assistants AssistantSectionConfigs
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string; assistantId: string }> }
) {
  const { userId } = await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data: assistantId } = getDataOrThrow((await params).assistantId, UuidSchema);

  const response = await prisma.assistantSectionConfig.deleteMany({
    where: {
      duty: {
        id: dutyId,
        userId: userId
      },
      assistantId: assistantId
    }
  });

  return Created(response);
}
