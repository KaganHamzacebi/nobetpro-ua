import { auth } from '@/libs/auth/auth';
import prisma from '@/libs/db/prisma';
import { Prisma } from '@prisma/client';
import { unauthorized } from 'next/navigation';

// Get All Default Assistants
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    unauthorized();
  }

  const data = await prisma.defaultAssistant.findMany({
    where: { userId: userId },
    orderBy: { name: 'asc' }
  });

  return Response.json(data);
}

// Create New Default Assistant
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  const body: Omit<Prisma.DefaultAssistantCreateInput, 'user'> = await request.json();
  const createData: Prisma.DefaultAssistantCreateInput = {
    ...body,
    user: {
      connect: {
        id: userId
      }
    }
  };

  const data = await prisma.defaultAssistant.create({
    data: createData
  });
  return Response.json(data);
}

// Update Default Assistants
export async function PUT(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  type UpdateInput = Prisma.DefaultAssistantUpdateInput & { id: string };
  const body: UpdateInput = await request.json();

  const response = await prisma.defaultAssistant.update({
    where: {
      id: body.id,
      userId: userId
    },
    data: body
  });

  return Response.json(response);
}
