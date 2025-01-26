import { auth } from '@/libs/auth/auth';
import prisma from '@/libs/db/prisma';
import { unauthorized } from 'next/navigation';

// Bulk Delete
export async function POST(request: Request) {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id;

  const idsToDelete = (await request.json()) as string[];
  await prisma.defaultSection.deleteMany({
    where: {
      id: { in: idsToDelete },
      userId: userId
    }
  });

  return Response.json(idsToDelete);
}
