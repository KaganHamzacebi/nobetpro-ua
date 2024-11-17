import prisma from '@/libs/db/prisma';
import { getUser } from '@/libs/supabase/server';
import { Prisma } from '@prisma/client';

// Get All Default Assistants
export async function GET() {
  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await prisma.defaultAssistant.findMany({
    where: { userId: userId },
    orderBy: { name: 'asc' }
  });

  return Response.json(data);
}

// Create New Default Assistant
export async function POST(request: Request) {
  const user = await getUser();
  const userId = user?.id;

  const body = (await request.json()) as { name: string };
  const createData: Prisma.DefaultAssistantCreateInput = {
    name: body.name,
    User: {
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
  const user = await getUser();
  const userId = user?.id;

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
