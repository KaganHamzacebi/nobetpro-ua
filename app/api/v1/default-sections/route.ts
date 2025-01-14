import prisma from '@/libs/db/prisma';
import { getUser } from '@/libs/supabase/server';
import { Prisma } from '@prisma/client';

// Get All Default Sections
export async function GET() {
  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await prisma.defaultSection.findMany({
    where: { userId: userId },
    orderBy: { name: 'asc' }
  });

  return Response.json(data);
}

// Create New Default Section
export async function POST(request: Request) {
  const user = await getUser();
  const userId = user?.id;

  // body should contain atleast name, color
  const body: Omit<Prisma.DefaultSectionCreateInput, 'User'> = await request.json();
  const createData: Prisma.DefaultSectionCreateInput = {
    ...body,
    User: {
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
  const user = await getUser();
  const userId = user?.id;

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
