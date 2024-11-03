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
    where: { userId: userId }
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
