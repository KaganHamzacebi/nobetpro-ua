import prisma from '@/libs/db/prisma';
import { getDataOrThrow, getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { Created } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Create Many Section Configs For Sections
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string; sectionId: string }> }
) {
  await getSessionOrThrow();
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);
  const { data: sectionId } = getDataOrThrow((await params).sectionId, UuidSchema);

  const createSchema = z
    .object({
      assistantId: UuidSchema,
      totalLimit: z.number().int().min(0)
    })
    .array()
    .min(1);

  const { data } = getDataOrThrow(await request.json(), createSchema);

  const response = await prisma.assistantSectionConfig.createMany({
    data: data.map(item => ({
      ...item,
      dutyId: dutyId,
      sectionId: sectionId
    })),
    skipDuplicates: true
  });

  return Created(response);
}
