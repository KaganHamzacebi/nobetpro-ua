import { auth } from '@/libs/auth/auth';
import prisma from '@/libs/db/prisma';
import { getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { Prisma } from '@prisma/client';
import { unauthorized } from 'next/navigation';

// Get All Default Sections
export async function GET() {
  const { userId } = await getSessionOrThrow();

  const data = await prisma.defaultSection.findMany({
    where: { userId: userId },
    orderBy: { name: 'asc' }
  });

  return Response.json(data);
}

// Create New Default Section
export async function POST(request: Request) {
  const { userId } = await getSessionOrThrow();

  const body: Omit<Prisma.DefaultSectionCreateInput, 'user'> = await request.json();
  const createData: Prisma.DefaultSectionCreateInput = {
    ...body,
    user: {
      connect: {
        id: userId
      }
    }
  };

  const data = await prisma.defaultSection.create({
    data: createData
  });
  return Response.json(data);
}

// Update Default Section
export async function PUT(request: Request) {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id;

  type UpdateInput = Prisma.DefaultSectionUpdateInput & { id: string };
  const body: UpdateInput = await request.json();

  const response = await prisma.defaultSection.update({
    where: {
      id: body.id,
      userId: userId
    },
    data: body
  });

  return Response.json(response);
}
