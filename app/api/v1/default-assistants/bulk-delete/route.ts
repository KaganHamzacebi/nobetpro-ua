import { auth } from '@/libs/auth/auth';
import prisma from '@/libs/db/prisma';
import { unauthorized } from 'next/navigation';

// Bulk Delete
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) unauthorized();

  const idsToDelete = (await request.json()) as string[];
  await prisma.defaultAssistant.deleteMany({
    where: {
      id: { in: idsToDelete },
      userId: userId
    }
  });

  return Response.json(idsToDelete);
}
