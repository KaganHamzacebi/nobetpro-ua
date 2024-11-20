import prisma from '@/libs/db/prisma';
import { getUser } from '@/libs/supabase/server';

// Bulk Delete
export async function POST(request: Request) {
  const user = await getUser();
  const userId = user?.id;

  const idsToDelete = (await request.json()) as string[];
  await prisma.defaultAssistant.deleteMany({
    where: {
      id: { in: idsToDelete },
      userId: userId
    }
  });

  return Response.json(idsToDelete);
}
